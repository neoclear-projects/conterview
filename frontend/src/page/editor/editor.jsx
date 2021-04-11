import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

import './editor.css';
import { Button, ButtonGroup, Divider, Input, List, Radio, Select } from 'semantic-ui-react';
import { Modal, Header, Icon } from 'semantic-ui-react';
import { Statistic, Result, Spin } from 'antd';
import Padding from '../../util/padding';
import './info.css';
// import Canvas from './canvas';
import '../../components/video/video.css';

import socketIOClient from "socket.io-client";
import { useEffect, useRef } from 'react';
import Peer from 'peerjs';

import { Splitter } from '@progress/kendo-react-layout';
import * as Monaco from 'monaco-editor';

// Loading options
import {
  tabSizeOptions,
  cursorWidthOptions,
  fontOptions,
} from './options';

// Setup types needed
import { Terminal } from './terminal';
import Video from '../../components/video/video';
import Problem from './problem';
import { getInterviewState, interviewStart, interviewStop, runCode, testCode, testCompilerError, testFailed, testPassed, testsAllPassed, updateComment, updateCurrentQuestion, updateRubric } from '../../api/editor-api';
import QuestionSelect from './question-select';
import TextArea from 'antd/lib/input/TextArea';
import errorLog from '../../components/error-log/error-log';
import InfoModal from './info-modal';

import queryString from 'query-string';
import { candidateLogin } from '../../api/auth-api';

const { Countdown } = Statistic;

const ENDPOINT = process.env.REACT_APP_SERVER;

const peer = new Peer();

const socket = socketIOClient(ENDPOINT);

let ignoreRemoteEvent = false;
let initializing = true;

socket.on('first-joined', () => {
  initializing = false;
  console.log('First joined!');
});

// reference: https://github.com/suren-atoyan/monaco-react#monaco-instance
// Official doc to obtain monaco instance from react component
function Editor({
  match, location
}) {
  // const [monaco, setMonaco] = useState(null);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const [themeLoaded, setThemeLoaded] = useState(false);
  const [inverted, setInterted] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState('cpp');
  const [bold, setBold] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [tabSize, setTabSize] = useState(2);
  const [cursorWidth, setCursorWidth] = useState(2);
  const [code, setCode] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [testing, setTesting] = useState(false);

  const [videoVisible, setVideoVisible] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [rubricVisible, setRubricVisible] = useState(false);

  const [output, setOutput] = useState('');

  const [myStream, setMyStream] = useState(null);
  const [streams, setStreams] = useState(new Map());
  const [id, setId] = useState(null);
  const streamsRef = useRef(new Map());

  const [visible, setVisible] = useState(true);

  const [panes, setPanes] = useState([
    { size: '60%', min: '50%' },
    { min: '20%' }
  ]);

  const [subPanes, setSubPanes] = useState([
    { size: '50%', min: '30%' },
    { min: '30%' }
  ]);

  const [interviewState, setInterviewState] = useState('pending');
  const [endTime, setEndTime] = useState(Date.now());
  const [questions, setQuestions] = useState([]);
  const [curQuestionIdx, setCurQuestionIdx] = useState(-1);
  const [candidateAuthorization, setCandidateAuthorization] = useState('');
  const [prepared, setPrepared] = useState(false);

  const positionId = match.params.positionId;
  const interviewId = match.params.interviewId;
  
  const refreshState = () => {
    console.log(questions);
    // console.log(questions[curQuestionIdx] ? questions[curQuestionIdx].problemName : null);

    getInterviewState(positionId, interviewId, res => {
      if (res.status === 'running') {
        setEndTime(new Date(new Date(res.startTime).getTime() + res.scheduledLength * 60000));
        setCurQuestionIdx(res.currentProblemIndex);
      } else {
        setEndTime(new Date());
      }

      setInterviewState(res.status);
      setQuestions(res.problemsSnapshot);
    }, errorLog);
  };

  useEffect(() => {
    let passcode = queryString.parse(location.search).passcode;
    if (passcode && candidateAuthorization !== 'success') {
      candidateLogin(interviewId, passcode, () => {
        setCandidateAuthorization('success');
      }, err => {
        if (err.response.data === 'access denied') {
          setCandidateAuthorization('failed');
        }
      });
      return;
    }

    if(!prepared){
      refreshState();

      peer.on('open', id => {
        console.log('peer connected');
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then(stream => {
          socket.emit('join', id, interviewId);

          console.log('stream acquired');
    
          peer.on('call', call => {
            call.answer(stream);
            call.on('stream', (newStream) => {
              streamsRef.current.set(call.peer, {
                stream: newStream,
                visibility: true
              });
              setStreams(new Map(streamsRef.current));
            })
          });
    
          peer.on('connection', conn => {
            conn.on('open', () => {
              conn.on('data', dat => {
                console.log('Data: ' + dat);
                if (initializing) {
                  if (monacoRef.current !== null)
                    monacoRef.current.editor.getModels()[0].setValue(dat);
                  initializing = false;
                }
              });
            });
          });
    
          socket.on('user-conn', userId => {
            console.log('New user: ' + userId);
    
            const call = peer.call(userId, stream);
            call.on('stream', newStream => {
              streamsRef.current.set(call.peer, {
                stream: newStream,
                visibility: true
              });
              setStreams(new Map(streamsRef.current));
            });
            
    
            const conn = peer.connect(userId);
            conn.on('open', () => {
              const editorContent = monacoRef.current.editor.getModels()[0].getValue();
    
              conn.send(editorContent);
              console.log('Sent: ' + editorContent);
            })
          });
    
          socket.on('stream-open', userId => {
            streamsRef.current.get(userId).visibility = true;
            setStreams(new Map(streamsRef.current));
          });
    
          socket.on('stream-close', userId => {
            streamsRef.current.get(userId).visibility = false;
            setStreams(new Map(streamsRef.current));
          });
    
          socket.on('user-disconn', userId => {
            streamsRef.current.delete(userId);
            setStreams(new Map(streamsRef.current));
          });
    
          socket.on('refresh', () => {
            refreshState();
            console.log('refreshed');
          });

          socket.on('pass', probName => {
            refreshState();
            testPassed(probName);
          });

          socket.on('fail', probName => testFailed(probName));

          socket.on('cperror', msg => testCompilerError(msg));

          socket.on('output', o => setOutput(o));

          setMyStream(stream);
        });

        setId(id);
      });
    }
    setPrepared(true);
  });

  let passcode = queryString.parse(location.search).passcode;
  switch (candidateAuthorization) {
    case '':
      if(passcode) return <Spin/>;
      break;
    case 'failed':
      return (
        <Result
          status='error'
          title='Access denied'
          subTitle='Invalid interviewId or passcode'
        />
      );
  }

  return (
    <div id='editor' style={{ backgroundColor: inverted ? '#222' : 'white' }}>
      <div id='toolbar'>
        <div id='begin'>
          <InfoModal inverted={inverted} />
          <Padding width={8} />
          <Modal
            size='tiny'
            closeIcon
            open={settingVisible}
            trigger={<Button color='instagram' onClick={() => setSettingVisible(true)}>Settings</Button>}
            onClose={() => setSettingVisible(false)}
            onOpen={() => setSettingVisible(true)}
          >
            <Header icon='list' content='Settings' />
            <Modal.Content>
              <List selection verticalAlign='middle'>
                <List.Item>
                  <List.Content floated='right'>
                    <Select
                      placeholder='Select your font size' options={fontOptions} onChange={(e, data) => {
                      setFontSize(data.value);
                    }}/>
                  </List.Content>
                  <List.Content>Font Size</List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated='right'>
                    <Select
                      options={tabSizeOptions}
                      onChange={(e, data) => setTabSize(data.value)}
                    />
                  </List.Content>
                  <List.Content>Tab Size</List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated='right'>
                    <Select
                      options={cursorWidthOptions}
                      onChange={(e, data) => setCursorWidth(data.value)}
                    />
                  </List.Content>
                  <List.Content>Cursor Width</List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated='right'>
                  <Radio
                    toggle
                    checked={bold}
                    onChange={(e, dat) => setBold(dat.checked)}
                  />
                  </List.Content>
                  <List.Content>Bold</List.Content>
                </List.Item>
              </List>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick={() => setSettingVisible(false)}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
          <Padding width={12} />
          <div>
              {
                function() {
                  let videos = [];
                  streams.forEach((value, key) => {
                    videos.push(
                      <Video visible={false} muted={false} key={key} stream={value.stream} />
                    );
                  })
                  return videos;
                }()
              }
            </div>
          <Modal
            size='large'
            closeIcon
            open={videoVisible}
            trigger={<Button color='instagram' onClick={() => setVideoVisible(true)}>Video</Button>}
            onClose={() => setVideoVisible(false)}
            onOpen={() => setVideoVisible(true)}
          >
            <Modal.Header content='Video' as='h1' />
            <Modal.Content scrolling>
              <div className='video-grid'>
                <div className='videos'>
                  { visible ? <Video visible={true} muted={true} stream={myStream} key='me' /> : null }
                  {
                    function() {
                      let videos = [];
                      streams.forEach((value, key) => {
                        if (value.visibility) {
                          videos.push(
                            <Video visible={true} muted={true} key={key} stream={value.stream} />
                          );
                        }
                      })
                      return videos;
                    }()
                  }
                </div>
                <Button color='blue' fluid onClick={() => {
                  socket.emit(!visible ? 'stream-open' : 'stream-close', id);
                  setVisible(!visible);
                }}>
                  Toggle Visibility
                </Button>
              </div>
            </Modal.Content>
          </Modal>
          <Padding width={12} />
          <Radio
            toggle
            checked={inverted}
            onChange={(e, dat) => {
              setInterted(dat.checked);
              monacoRef.current?.editor.setTheme(dat.checked ? 'monokai' : 'xcode');
            }}
          />
        </div>
        <div id='end'>
          { passcode ? null :
            <Modal
              size='small'
              closeIcon
              open={rubricVisible}
              trigger={<Button color='facebook'>Rubric</Button>}
              onClose={() => {
                setRubricVisible(false);
                
              }}
              onOpen={() => setRubricVisible(true)}
            >
              <Modal.Header>Sliding Window</Modal.Header>
              <Modal.Content>
              <List selection verticalAlign='middle'>
                {
                  (function() {
                    let res = [];
                    if (curQuestionIdx === -1 || curQuestionIdx >= questions.length)
                      return [];
                    for (let i = 0; i < questions[curQuestionIdx].problemRubric.length; i++) {
                      let rubric = questions[curQuestionIdx].problemRubric[i];
                      res.push(
                        <List.Item>
                          <List.Content floated='right'>
                            <Input labelPosition='right' label={`/${rubric.rating}`} type='number' defaultValue={rubric.curRating} onChange={(event, data) => {
                              updateRubric(positionId, interviewId, curQuestionIdx, i, parseInt(data.value) || 0, refreshState, errorLog);
                              socket.emit('refresh');
                            }} />
                          </List.Content>
                          <List.Header as='h3'>{rubric.name}</List.Header>
                          <List.Description>{rubric.desc}</List.Description>
                        </List.Item>
                      );
                    }
                    return res;
                  })()
                }
              </List>
              <TextArea style={{
                borderRadius: 8,
                outline: 'none'
              }}
                placeholder='Comments'
                defaultValue={questions[curQuestionIdx] ? questions[curQuestionIdx].comment : null}
                onChange={e => {
                  updateComment(positionId, interviewId, curQuestionIdx, e.target.value, refreshState, errorLog);
                  socket.emit('refresh');
                }}
              />
              </Modal.Content>
            </Modal>
          }
          <Padding width={12} />
          { passcode ? null :
            <Modal
              size='small'
              closeIcon
              open={dashboardVisible}
              trigger={<Button color='olive' >DashBoard</Button>}
              onClose={() => setDashboardVisible(false)}
              onOpen={() => setDashboardVisible(true)}
            >
              <Modal.Header>Control Pannel</Modal.Header>
              <Modal.Content>
              <List selection verticalAlign='middle'>
                <List.Item>
                  <List.Content floated='right'>
                    {
                      (function() {
                        if (interviewState === 'pending')
                          return (
                            <Button color='green' onClick={() => {
                              interviewStart(positionId, interviewId, () => {
                                // Start interview
                                refreshState();
                                socket.emit('refresh');
                              }, errorLog)
                            }}>
                              <Icon name='play' /> Start Interview
                            </Button>
                          );
                        else if (interviewState === 'running')
                          return (
                            <Button color='red' onClick={() => {
                              interviewStop(positionId, interviewId, () => {
                                // Stop interview
                                socket.emit('refresh');
                                refreshState();
                              }, errorLog)
                            }}>
                              <Icon name='stop' /> End Interview
                            </Button>
                          );
                        else if (interviewState === 'finished')
                          return (
                            <Button color='grey' disabled>
                              Interview Finished
                            </Button>
                          );
                        else
                          return null;
                      })()
                    }
                  </List.Content>
                  <List.Content><Header content='Interview Control' as='h3' /></List.Content>
                </List.Item>
                <Divider />
                {
                  (function() {
                    let ans = [];
                    for (let i = 0; i < questions.length; i++) {
                      ans.push(
                        <QuestionSelect
                          content={questions[i].problemName}
                          onClick={() => {
                            updateCurrentQuestion(positionId, interviewId, i, () => {
                              setCurQuestionIdx(i);
                              refreshState();
                              socket.emit('refresh');
                            }, errorLog);
                          }}
                          checked={i === curQuestionIdx}
                          grade={(function() {
                            const rubric = questions[i].problemRubric;
                            if (rubric.length === 0) return 0;
                            
                            const grades = rubric.reduce((acc, e) => {
                              return { curRating: acc.curRating + e.curRating, rating: acc.rating + e.rating };
                            });

                            console.log(grades);

                            return Math.floor(grades.curRating * 100 / grades.rating);
                          })()}
                          passed={questions[i].allPassed}
                        />
                      );
                    }
                    return ans;
                  })()
                }
              </List>
              </Modal.Content>
            </Modal>
          }
          <Padding width={16} />
          <Countdown value={endTime} />
          <Padding width={16} />
          <Button.Group inverted={inverted}>
            <Button toggle active={language === 'cpp'} inverted={inverted} onClick={() => setLanguage('cpp')}>C++</Button>
            <Button toggle active={language === 'java'} inverted={inverted} onClick={() => setLanguage('java')}>Java</Button>
            <Button toggle active={language === 'python'} inverted={inverted} onClick={() => setLanguage('python')}>Python</Button>
            <Button toggle active={language === 'javascript'} inverted={inverted} onClick={() => setLanguage('javascript')}>Javascript</Button>
            <Button toggle active={language === 'typescript'} inverted={inverted} onClick={() => setLanguage('typescript')}>Typescript</Button>
          </Button.Group>
          <Padding width={16} />
          <ButtonGroup>
            <Button basic onClick={() => {
              setCompiling(true);
              runCode(positionId, interviewId, curQuestionIdx, monacoRef.current.editor.getModels()[0].getValue(), language, out => {
                setOutput(out);
                socket.emit('output', out);
                setCompiling(false);
              }, err => {
                errorLog(err);
                setCompiling(false);
              });
            }}
              color={compiling ? 'grey' : 'red'}
              disabled={compiling}
            >
              <Icon name='play' /> {compiling ? 'Building' : 'Run'}
            </Button>
            <Button onClick={() => {
              setTesting(true);
              testCode(positionId, interviewId, curQuestionIdx, monacoRef.current.editor.getModels()[0].getValue(), language, (result, msg) => {
                if (result === 'pass') {
                  testPassed(questions[curQuestionIdx].problemName);
                  socket.emit('pass', questions[curQuestionIdx].problemName);
                } else if (result === 'fail') {
                  testFailed(questions[curQuestionIdx].problemName);
                  socket.emit('fail', questions[curQuestionIdx].problemName);
                } else if (result === 'cperror') {
                  testCompilerError(msg);
                  socket.emit('cperror', msg);
                }
                setTesting(false);
              }, err => {
                errorLog(err);
                setTesting(false);
              })
            }}
              color={testing ? 'grey' : 'red'}
              disabled={testing}
            >
              <Icon name='bug' /> {testing ? 'Building' : 'Test'}
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <Splitter
        style={{
          height: 'calc(100vh - 60px)',
          backgroundColor: inverted ? '#222' : 'white'
        }}
        panes={panes}
        onChange={(event) => setPanes(event.newState)}
      >
        <div>
          <MonacoEditor
            height='calc(100vh - 100px)'
            width='100%'
            defaultLanguage='cpp'
            language={language}
            value={code}
            onMount={(e, m) => {
              monacoRef.current = m;
              editorRef.current = e;

              if (!themeLoaded) {
                import('monaco-themes/themes/Xcode_default.json').then(data => {
                  m.editor.defineTheme('xcode', data);
                  m.editor.setTheme('xcode');
                });
                import('monaco-themes/themes/Monokai.json').then(data => {
                  m.editor.defineTheme('monokai', data);
                });
                e.onDidChangeModelContent(change => {
                  console.log(`ignoreRemoteEvent: ${ignoreRemoteEvent}, initializing: ${initializing}`);
                  if (ignoreRemoteEvent || initializing)
                    return;

                  socket.emit('code', change);
                  setCode(m.editor.getModels()[0].getValue());
                });
        
                socket.on('code', event => {
                  for (let i = 0; i < event.changes.length; i++) {
                    let change = event.changes[i];
        
                    // Citation: https://github.com/monsterooo/monaco-editor-sync/blob/master/client.js
                    try {
                      ignoreRemoteEvent = true;

                      let endCursorState = [{
                          range: new Monaco.Range(
                            change.range.startLineNumber,
                            change.range.startColumn,
                            change.range.endLineNumber,
                            change.range.endColumn),
                          text: change.text
                      }];

                      e.getModel().pushEditOperations(e.getSelections(), endCursorState, () => {
                        return null;
                      })
                      e.getModel().pushStackElement();
                      e.setSelections(endCursorState);

                      e.executeEdits();

                      setCode(m.editor.getModels()[0].getValue());
                    } finally {
                      ignoreRemoteEvent = false;
                    }
                  }
                });
          
                setThemeLoaded(true);
              }
            }}
            options={{
              language: language,
              fontSize: fontSize,
              tabSize: tabSize,
              fontFamily: 'monospace',
              fontWeight: bold ? 'bold' : 'light',
              cursorWidth: cursorWidth
            }}
          />
        </div>
        <Splitter
          orientation='vertical'
          style={{
            height: 'calc(100vh - 90px)',
            backgroundColor: inverted ? '#222' : 'white'
          }}
          panes={subPanes}
          onChange={(event) => setSubPanes(event.newState)}
        >
          <Problem
            problemName={questions[curQuestionIdx] ? questions[curQuestionIdx].problemName : null}
            description={questions[curQuestionIdx] ? questions[curQuestionIdx].description : null}
            preferedLang={questions[curQuestionIdx] ? questions[curQuestionIdx].preferredLanguage : null}
          />
          <div>
            <Terminal colorMode={inverted} text={output} fontSize={fontSize + 4} bold={bold} />
          </div>
        </Splitter>
      </Splitter>
    </div>
  );
}

export default Editor;
