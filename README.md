# Conterview

### Team Members
+ Ziheng Zhuang ziheng.zhuang@mail.utoronto.ca
+ Qingtian Wang qingtian.wang@mail.utoronto.ca
+ Quanhong Liu quanhong.liu@mail.utoronto.ca

## Description

Conterview is a website for continuous coding interview conduction.
Recruiters are allowed to create, conduct and manage coding interviews on conterview.

## Beta Version Features
+ Interviewer can create a position to accept interviews
+ Interviewer can create coding interview for a position
+ Interviewer can add coding questions to a interview
+ Interviewer can send interview invitation link to interviewee and other interviewers
+ Interviewee & other interviewers can join interview with the passcode attached in the invitation email
+ Interviewee & interviewers can communication through video and audio meeting, and meeting page and be hidden in question solving part
+ Interviewee can see description of each question and has an editor to write code in any language prefered
+ Interviewers can grade interviewee's performance
+ Interviewers can choose to move to next question or end the interview

## Final Version Features
+ Interviewer can pick questions from question library
+ Interviewer can add test cases for a coding question
+ Interviewee can run his code
+ Interviewee & interviewers can use a collaborative white board to share ideas
+ Interviewee & interviewers can run test cases to test code
+ After all interview finishes, conterview can collect grades of each interviewer and rank them


## Technologies Might Use

+ A backend framework for backend dev, possibly Express.js
+ A frontend framework to design frontend, possibly React
+ A database to store interview and user data, possibly Mongodb
+ Technology to do video and audio conferencing, possibly webRTC
+ Technology for collaborative code editing and white board sharing, possibly PeerJS
+ MonacoEditor for online code editing
+ XTermJS for web shell UI
+ CassowaryJS for workspace splitting
+ Might use GraphQL as backend API
+ Data visualization framework for showing interview results, possibly Chart.js

## Top 5 Technical Challenges

+ Interviewee is allowed to run the code, which would pose security issue since it interacts with the OS
+ Editor framework is uncommon on the web, and is hard to integrate into our app
+ Need to put a lot of components in one page for interview, including editor, shell UI, show & hide video meeting, show & hide collaborative white board
+ Need to synchronize between users, (for editor and white board)
+ Need to integrate a lot of APIs (editor API, shell API, synchronization API, video/audio conferencing API, data visualization API)
