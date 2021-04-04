import { useState } from 'react';
import { Modal, Button, Header, Divider, Icon } from 'semantic-ui-react';
import { CodeBlock } from "react-code-blocks";

export default function InfoModal({
  inverted
}) {
  const [infoVisible, setInfoVisible] = useState(false);

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
  )
}