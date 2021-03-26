import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { CodeBlock } from "react-code-blocks";

import './editor.css';
import { Button, Divider, Image, Input, List, Radio, Select } from 'semantic-ui-react';
import { Modal, Header, Icon } from 'semantic-ui-react';
import { Statistic } from 'antd';
import Padding from '../../util/padding';
import './info.css';
// import Canvas from './canvas';
import '../../components/video/video.css';

import socketIOClient from "socket.io-client";
import { useEffect, useRef } from 'react';
import Peer from 'peerjs';

import { Splitter } from '@progress/kendo-react-layout';
import * as Monaco from 'monaco-editor';
import req from '../../api/req';

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
import { getInterviewState, interviewStart, interviewStop, updateCurrentQuestion } from '../../api/editor-api';
import QuestionSelect from './question-select';
import TextArea from 'antd/lib/input/TextArea';

const { Countdown } = Statistic;

const ENDPOINT = process.env.REACT_APP_SERVER;

const peer = new Peer();

const socket = socketIOClient(ENDPOINT);

let ignoreRemoteEvent = false;

// reference: https://github.com/suren-atoyan/monaco-react#monaco-instance
// Official doc to obtain monaco instance from react component
function Editor({
  match
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
  const [infoVisible, setInfoVisible] = useState(false);
  const [tabSize, setTabSize] = useState(2);
  const [cursorWidth, setCursorWidth] = useState(2);
  const [code, setCode] = useState('');
  const [compiling, setCompiling] = useState(false);

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

  const positionId = match.params.positionId;
  const interviewId = match.params.interviewId;

  const refreshState = () => {
    getInterviewState(positionId, interviewId, res => {
      console.log(res);
      if (res.status == 'running') {
        setEndTime(new Date(new Date(res.startTime).getTime() + res.scheduledLength * 60000));
        console.log(res);
        setCurQuestionIdx(res.currentProblemIndex);
      }
      setInterviewState(res.status);
      setQuestions(res.problems);
    }, err => console.error(err));
  };

  useEffect(() => {
    refreshState();

    peer.on('open', id => {
      console.log(id);
      socket.emit('join', id, interviewId);
      setId(id);
    });

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
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

      socket.on('user-conn', (userId) => {
        console.log('User connected ' + userId);
        const call = peer.call(userId, stream);
        call.on('stream', (newStream) => {
          streamsRef.current.set(call.peer, {
            stream: newStream,
            visibility: true
          });
          setStreams(new Map(streamsRef.current));
        });
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

      socket.on('refresh', refreshState);

      setMyStream(stream);
    });
  }, []);

  const infoButton = (
    <Button
      basic={!inverted}
      color='black'
      floated='left'
      inverted={inverted}
    >
      Information
    </Button>
  );
  return (
    <div id='editor' style={{ backgroundColor: inverted ? '#222' : 'white' }}>
      <div id='toolbar'>
        <div id='begin'>
          <Modal
            closeIcon
            open={infoVisible}
            onClose={() => setInfoVisible(false)}
            onOpen={() => setInfoVisible(true)}
            trigger={infoButton}
          >
            <Modal.Header content='Information' as='h1' />
            <Modal.Content scrolling>
              <Header content='Execution Environment' as='h2' />
              <p>
                To safely run code in various language, a sandbox is used to prevent malicious code execution contaminate backend environment. For conterview, docker is used as the sandbox in the backend.
              </p>
              <p>
                To prevent information leakage, docker container of conterview will not mount host directory into virtual file system. Instead, for all possible language execution, stdin is used to write to files in docker image, outputs are read from stdout of docker image.
              </p>
              <Divider />
              <Header content='Language Execution Command' as='h2' />
              <p>
                The execution docker image is based on ubuntu 20.04 with all necessary compiling softwares installed.
              </p>
              <p>
                Five languages are supported in conterview online interview IDE. These five languages are chosen carefully: C++ and Java are classical competitive programming languages, python is the language for data analytics, javascript and typescript for web design. All codes written in conterview IDE will be executed as one of these five languages.
              </p>
              <p>All C++ codes would be executed using g++ 9.3.0 with the following flag</p>
              <CodeBlock
                text='g++ -std=c++17; ./{binary}'
                language='shell'
                showLineNumbers={true}
                wrapLines
              />
              <p>All Java codes would be executed using openjdk 11.0.10 with the following flag</p>
              <CodeBlock
                text='java ./{code}'
                language='shell'
                showLineNumbers={true}
                wrapLines
              />
              <p>All Python codes would be executed using python 3.8.5 with the following flag</p>
              <CodeBlock
                text='python ./{code}'
                language='shell'
                showLineNumbers={true}
                wrapLines
              />
              <p>All Javascript codes would be executed using nodejs v10.19.0 with the following flag</p>
              <CodeBlock
                text='node ./{code}'
                language='shell'
                showLineNumbers={true}
                wrapLines
              />
              <p>All Typescript codes would be executed using ts-nodejs v9.1.1 with the following flag</p>
              <CodeBlock
                text='ts-node ./{code}'
                language='shell'
                showLineNumbers={true}
                wrapLines
              />
              <Divider />
              <Header content='Testing And IO' as='h2' />
              <p>
                Programs are tested using standard IO. Programs read inputs from stdin as specified by problem description, and testing software obtains output from stdout and compare to the expected output. A match in the output would give you a passed test case.
              </p>
              <p>
                Users are also allowed to run programs without testing. However, users have to hard-code data into their code because stdin is disabled in running mode.
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick={() => setInfoVisible(false)}>
                <Icon name='checkmark' /> Ok
              </Button>
            </Modal.Actions>
          </Modal>
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
          <Modal
            size='small'
            closeIcon
            open={rubricVisible}
            trigger={<Button color='facebook'>Rubric</Button>}
            onClose={() => setRubricVisible(false)}
            onOpen={() => setRubricVisible(true)}
          >
            <Modal.Header>Sliding Window</Modal.Header>
            <Modal.Content>
            <List selection verticalAlign='middle'>
              <List.Item>
                <List.Content floated='right'>
                  <Input labelPosition='right' label='/10' type='number' />
                </List.Content>
                <List.Header as='h3'>Rubric One</List.Header>
                <List.Description>ASDDASDASDAWSD</List.Description>
              </List.Item>
            </List>
            <TextArea style={{
              borderRadius: 8,
              outline: 'none'
            }} placeholder='Comments' />
            </Modal.Content>
            <Modal.Actions>
              <Button color='red'>
                <Icon name='cancel' /> Cancel
              </Button>
              <Button color='green'>
                <Icon name='checkmark' /> Update
              </Button>
            </Modal.Actions>
          </Modal>
          <Padding width={12} />
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
                      console.log(interviewState)
                      if (interviewState == 'pending')
                        return (
                          <Button color='green' onClick={() => {
                            interviewStart(positionId, interviewId, () => {
                              // Start interview
                              refreshState();
                              socket.emit('refresh');
                            }, err => console.error(err))
                          }}>
                            <Icon name='play' /> Start Interview
                          </Button>
                        );
                      else if (interviewState == 'running')
                        return (
                          <Button color='red' onClick={() => {
                            interviewStop(positionId, interviewId, () => {
                              // Stop interview
                              refreshState();
                              socket.emit('refresh');
                            }, err => console.error(err))
                          }}>
                            <Icon name='stop' /> End Interview
                          </Button>
                        );
                      else if (interviewState == 'finished')
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
                          }, err => console.error(err));
                        }}
                        checked={i == curQuestionIdx}
                      />
                    );
                  }
                  return ans;
                })()
              }
            </List>
            </Modal.Content>
          </Modal>
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
          <Button onClick={() => {
              setCompiling(true);
              req.post(
                '/exec/run',
                JSON.stringify({
                  'language': language,
                  'code': code // monaco.editor.getValue()
                })
              )
              .then((res) => {
                setOutput(output + '[LOG]: \n' + res.data.output);
                setCompiling(false);
              });
            }}
            color={compiling ? 'grey' : 'red'}
            disabled={compiling}
          >
            <Icon name='play' /> {compiling ? 'Building' : 'Run'}
          </Button>
        </div>
      </div>
      {/* <Progress size='small' color='red' percent={60} label={new Date()} active /> */}
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
                  if (ignoreRemoteEvent)
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
              fontFamily: 'Monaco',
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
          <Problem problemId={curQuestionIdx == -1 || curQuestionIdx >= questions.length ? null : questions[curQuestionIdx]._id} />
          <div>
            <Terminal colorMode={inverted} text={output} fontSize={fontSize + 4} bold={bold} />
          </div>
        </Splitter>
      </Splitter>
    </div>
  );
}

export default Editor;
