# Conterview

## Team Members
+ Ziheng Zhuang ziheng.zhuang@mail.utoronto.ca
+ Qingtian Wang qingtian.wang@mail.utoronto.ca
+ Quanhong Liu quanhong.liu@mail.utoronto.ca

## Notes Before Reading

+ Our app requires a camera and a microphone. If you didn't see video in interview page, try to refresh

+ Our app gives a separate authentication for caididates who login using provided url. Thus, try to use a separate browser for candidate logins, or would cause trouble

## Public URL

[Link To Conterview](https://www.conterview.com/)

## Video Link

[Link To Demo Video](https://www.youtube.com/watch?v=2RTqSSH7_k4)

### Socket.IO

We used socket.io for real-time synchronization among interviewers and candidates.

Socket Event | Payload | Description
-------------|---------|------------
join | userId, interviewId | Join user with id userId to room with room id interviewId
refresh | | Tell every user in the room to fetch data from server
code | codeChange | Inform other users in the same interview to apply this code edit change
stream-open | userId | Tell other users in the same room that user with userId want to show the video
stream-close | userId | Tell other users in the same room that user with userId want to hide video
pass | questionName | Testing passed for question with questionName
fail | questionName | Testing failed for question with questionName
cperror | errorMsg | Testing errored with errorMsg
output | out | Code executed with output out
disconnect | | This socket connection closed
