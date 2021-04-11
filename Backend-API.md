# BACKEND API

## AUTH

#### POST /api/auth/register/

- description: register and then login
- request: `POST /api/auth/register/`   
    - content-type: `application/json`
    - body: object
      - organization: (string) the organization name of the user
      - passcode: (string) the passcode of the organization
      - username: (string) the username of the user
      - password: (string) the password of the user
      - email: (string) the email of the user
- response: 200
    - content-type: `application/json`
    - body: object
      - organizationId: (string) the organizationId of the user
      - username: (string) the username of the user
      - _id: (string) the id of the user
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - organization is needed and should be non-empty string
        - passcode is needed and should be non-empty string
        - username is needed and should be non-empty string
        - password is needed and should be non-empty string
        - email is needed and should be email formatted
- response: 404
    - content-type: `text/plain`
    - body: organization does not exist
- response: 401
    - content-type: `text/plain`
    - body: wrong passcode
- response: 409
    - content-type: `text/plain`
    - body: username already exists
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"organization":"UofT","passcode":"myPasscode","username":"Tom Jackson","password":"myPassword", "email":"123@gmail.com"}' \
       'http://localhost:3001/api/auth/register/'
```

#### POST /api/auth/login/

- description: login
- request: `POST /api/auth/login/`   
    - content-type: `application/json`
    - body: object
      - username: (string) the username of the user
      - password: (string) the password of the user
- response: 200
    - content-type: `application/json`
    - body: object
      - organizationId: (string) the organizationId of the user
      - username: (string) the username of the user
      - _id: (string) the id of the user
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - username is needed and should be non-empty string
        - password is needed and should be non-empty string
- response: 401
    - content-type: `text/plain`
    - body: access denied
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"username":"Tom Jackson","password":"myPassword"}' \
       'http://localhost:3001/api/auth/login/'
```

#### GET /api/auth/logout/

- description: logout
- request: `POST /api/auth/logout/`   
- response: 200
    - content-type: `text/plain`
    - body: user ${username} signed out
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/auth/logout'
```

#### POST /api/auth/candidate-login/

- description: login as interview candidate
- request: `POST /api/auth/candidate-login/`   
    - content-type: `application/json`
    - body: object
      - interviewId: (string) the id of the interview
      - password: (string) the password to join the interview
- response: 200
    - content-type: `application/json`
    - body: object
      - organizationId: (string) the organizationId of the interview
      - interviewId: (string) the id of the interview
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - id invalid: interview
        - passcode is needed and should be non-empty string
- response: 401
    - content-type: `text/plain`
    - body: access denied
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"interviewId":"606ba8f396cf3840a4692798","passcode":"myPasscode"}' \
       'http://localhost:3001/api/auth/candidate-login/'
```

## ORGANIZATION

#### POST /api/organization/

- description: create an organization
- request: `POST /api/organization/`   
    - content-type: `application/json`
    - body: object
      - name: (string) the name of the organization
      - password: (string) the password to join the organization
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the organization
      - name: (string) the name of the organization
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - organization name is needed and should be non-empty string
        - organization passcode is needed and should be non-empty string
- response: 409
    - content-type: `text/plain`
    - body: organization already exists
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"name":"UofT","passcode":"myPasscode"}' \
       'http://localhost:3001/api/organization/'
```

#### ANY REQUEST START WITH /api/organization/:organizationId/

- response: 400
    - content-type: `text/plain`
    - body: id invalid: organization
- response: 404
    - content-type: `text/plain`
    - body: organization #${id} does not exist

## POSITION

#### POST /api/organization/:organizationId/position/

- description: create a position
- access: is organization user
- request: `POST /api/organization/:organizationId/position/`   
    - content-type: `application/json`
    - body: object
      - name: (string) the name of the position
      - description: (string) the description of the position
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the position
      - name: (string) the name of the position
      - description: (string) the description of the position
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - position name is needed and should be non-empty string
        - position description is needed and should be non-empty string
- response: 409
    - content-type: `text/plain`
    - body: position with this name already exists
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"name":"Software Developer","descriprion":"myDescription"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/'
```

#### GET /api/organization/:organizationId/position/

- description: get positions of an organization
- access: is organization user
- request: `GET /api/organization/:organizationId/position/`   
    - query parameters:
        - page: (int) page to retrieve (optional) default to 1
        - nameContains: (string) only get position with name having nameContains (optional)
        - allFinished: (bool) only get position with all interviews finished (optional)
- response: 200
    - content-type: `application/json`
    - body: object
        - totalPage: total number of pages for this query
        - positions: array of object
            - _id: (string) the id of the position
            - name: (string) the name of the position
            - description: (string) the description of the position
            - pendingInterviewNum: (int) the number of interviews that are pending of the position
            - finishedInterviewNum: (int) the number of interviews that are finished of the position
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - page should be non-negative integer
        - nameContains should be non-empty string
        - allFinished should be boolean
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/'
```

#### ANY REQUEST START WITH /api/organization/:organizationId/position/:positionId/

- response: 400
    - content-type: `text/plain`
    - body: id invalid: position
- response: 404
    - content-type: `text/plain`
    - body: position #${positionId} not found for organization #${organizationId}

#### PATCH /api/organization/:organizationId/position/:positionId/

- description: create a position
- access: is organization user
- request: `PATCH /api/organization/:organizationId/position/:positionId/`   
    - content-type: `application/json`
    - body: object
      - name: (string) the name of the position (optional)
      - description: (string) the description of the position (optional)
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the position
      - name: (string) the name of the position
      - description: (string) the description of the position
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - position name should be non-empty string
        - position description should be non-empty string
- response: 409
    - content-type: `text/plain`
    - body: Position with this name already exists
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"name":"Software Developer","descriprion":"myDescription"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/'
```

#### GET /api/organization/:organizationId/position/:positionId/

- description: get a position
- access: is organization user
- request: `GET /api/organization/:organizationId/position/:positionId/`   
- response: 200
    - content-type: `application/json`
    - body: object
        - _id: (string) the id of the position
        - name: (string) the name of the position
        - description: (string) the description of the position
        - pendingInterviewNum: (int) the number of interviews that are pending of the position
        - finishedInterviewNum: (int) the number of interviews that are finished of the position
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/'
```

#### DELETE /api/organization/:organizationId/position/:positionId/

- description: delete a position and its interviews
- access: is organization user
- request: `DELETE /api/organization/:organizationId/position/:positionId/`   
- response: 200
    - content-type: `application/json`
    - body: object
        - _id: (string) the id of the position
        - name: (string) the name of the position
        - description: (string) the description of the position
        - pendingInterviewNum: (int) the number of interviews that are pending of the position
        - finishedInterviewNum: (int) the number of interviews that are finished of the position
``` 
$ curl -b cookie.txt -c cookie.txt -X DELETE 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/'
```

## INTERVIEW

#### POST /api/organization/:organizationId/position/:positionId/interview/

- description: create an interview and send email notification to candidate
- access: is organization user
- request: `POST /api/organization/:organizationId/position/:positionId/interview/`   
    - content-type: `application/json`
    - body: object
      - candidate: object
        - name: (string) candidate name
        - email: (string) candidate email
      - problemIds: array of (string) problemIds
      - interviewerIds: array of (string) interviewerIds
      - scheduledTime: (string) scheduled starting time of the interview
      - scheduledLength: (int) scheduled length of the interview in minutes
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the position
      - the rest are the same as request body
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - candidate name is needed and should be non-empty string
        - candidate email is needed and should be email formatted
        - problemIds is needed and cannot be empty
        - problemIds should be valid objectIds
        - interviewerIds is needed and cannot be empty
        - interviewerIds should be valid objectIds
        - scheduledTime is needed and should be in ISOString format
        - scheduledLength is needed and should be positive integer
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"candidate":{"name":"Joe","email":"wow@haha.com"},"problemIds":["606ba8e296cf3840a4692796"],"interviewerIds":["606a8f1c5c10601d8ce3369f"],scheduledTime:"2011-10-05T14:48:00.000Z","scheduledLength":90}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/'
```

#### GET /api/organization/:organizationId/position/:positionId/interview/

- description: get interviews of a position
- access: is organization user
- request: `GET /api/organization/:organizationId/position/:positionId/interview/`   
    - query parameters:
        - page: (int) page to retrieve (optional) default to 1
        - status: (string) only get interviews in this status
- response: 200
    - content-type: `application/json`
    - body: array of object
        - _id: (string) the id of the interview
        - candidate: object
            - name: (string) name of the candidate
            - email: (string) email of the candidate
        - scheduledTime: (string) scheduled starting time of the interview
        - status: (string) the status of the interview
        - totalGrade: (int) the total grade earned by candidate
        - maxTotalGrade: (int) the maximum grade of the interview
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/'
```

#### ANY REQUEST START WITH /api/organization/:organizationId/position/:positionId/interview/:interviewId

- response: 400
    - content-type: `text/plain`
    - body: id invalid: interview
- response: 404
    - content-type: `text/plain`
    - body: interview #${interviewId} not found for position #${positionId}

#### GET /api/organization/:organizationId/position/:positionId/interview/:interviewId/

- description: get an interview
- access: is organization user or interview candidate
- request: `GET /api/organization/:organizationId/position/:positionId/interview/:interviewId/`   
    - query parameters:
        - status: (string) only get interviews in this status
- response: 200
    - content-type: `application/json`
    - body: object
        - _id: (string) the id of the interview
        - candidate: object
            - name: (string) name of the candidate
            - email: (string) email of the candidate
        - problems: array of object
            - _id: (string) id of the problem
            - problemName: (string) name of the problem
        - interviewers: array of object
            - _id: (string) id of the interviewer
            - username: (string) username of the interviewer
            - email: (string) email of the interviewer
            - department: (string) department of the interviewer
            - title: (string) title of the interviewer
            - personalStatement: (string) personal statement of the interviewer
        - problemsSnapshot: array of object
            - _id: (string) the problem's id
            - problemName: (string) the problem's name
            - description: (string) the problem's description
            - StarterCodes: (Array) the problem's starter codes
            - correctRate: (number) the problem's average correct rate by interviewees
            - preferredLanguage: (string) the problem's most picked language by interviewees 
            - problemInputSet: (Array) the problem's input data set
            - problemOutputSet: (Array) the problem's output data set
            - problemRubric: (Array) the problem's rubric
            - comment: (string) interviewers comment on candidate's performance on this problem
            - allPassed: (bool) whether all test cases are passed
        - position: object
            - _id: (string) id of the position
            - name: (string) name of the position
        - scheduledTime: (string) scheduled starting time of the interview
        - startTime: (string) started time of the interview
        - finishTime: (string) finished time of the interview
        - status: (string) the status of the interview
        - scheduledLength: (int) scheduled length of the interview in minutes
        - currentProblemIndex: (int) current problem being presented for this interview
        - totalGrade: (int) total grades earned by the candidate
        - maxTotalGrade: (int) total grades set for this interview
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/'
```

#### PATCH /api/organization/:organizationId/position/:positionId/interview/:interviewId/

- description: update an interview
- access: is organization user
- request: `PATCH /api/organization/:organizationId/position/:positionId/interview/:interviewId/`   
    - content-type: `application/json`
    - body: object
      - candidate: object
        - name: (string) candidate name (optional)
        - email: (string) candidate email (optional)
      - problemIds: array of (string) problemIds (optional)
      - interviewerIds: array of (string) interviewerIds (optional)
      - scheduledTime: (string) scheduled starting time of the interview (optional)
      - scheduledLength: (int) scheduled length of the interview in minutes (optional)
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the position
      - the rest are the same as request body
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - candidate name should be non-empty string
        - candidate email should be email formatted
        - problemIds cannot be empty
        - problemIds should be valid objectIds
        - interviewerIds cannot be empty
        - interviewerIds should be valid objectIds
        - scheduledTime should be in ISOString format
        - scheduledLength should be positive integer
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"candidate":{"name":"Joe","email":"wow@haha.com"},"problemIds":["606ba8e296cf3840a4692796"],"interviewerIds":["606a8f1c5c10601d8ce3369f"],scheduledTime:"2011-10-05T14:48:00.000Z","scheduledLength":90}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/'
```

#### DELETE /api/organization/:organizationId/position/:positionId/interview/:interviewId/

- description: delete an pending interview
- access: is organization user
- request: `DELETE /api/organization/:organizationId/position/:positionId/interview/:interviewId/`   
- response: 200
    - content-type: `application/json`
    - body: array of object
        - _id: (string) the id of the interview
        - candidate: object
            - name: (string) name of the candidate
            - email: (string) email of the candidate
        - scheduledTime: (string) scheduled starting time of the interview
        - status: (string) the status of the interview
- response: 403
    - content-type: `text/plain`
    - body: cannot delete a non-pending interview
``` 
$ curl -b cookie.txt -c cookie.txt -X DELETE 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/'
```

#### PATCH /api/organization/:organizationId/position/:positionId/interview/:interviewId/status/

- description: update the status and related fields of an interview
- access: is interviewer
- request: `POST /api/organization/:organizationId/position/:positionId/interview/:interviewId/status/`   
    - content-type: `application/json`
    - body: object
      - status: (string) status to update to
- response: 200
    - content-type: `application/json`
    - body: array of object
        - _id: (string) the id of the interview
        - candidate: object
            - name: (string) name of the candidate
            - email: (string) email of the candidate
        - scheduledTime: (string) scheduled starting time of the interview
        - status: (string) the status of the interview
- response: 400
    - content-type: `text/plain`
    - body: status should be in running or finished
- response: 403
    - content-type: `text/plain`
    - body: one of:
        - can only set to running from pending
        - can only set to finished from running
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"status":"running"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/status/'
```

#### PATCH /api/organization/:organizationId/position/:positionId/interview/:interviewId/current-problem-index/

- description: update the currenlt presented problem of an interview
- access: is interviewer
- request: `POST /api/organization/:organizationId/position/:positionId/interview/:interviewId/current-problem-index/`   
    - content-type: `application/json`
    - body: object
      - index: (int) index of problem to update to (optional)
      - next: (bool) change to next problem (optional)
      - prev: (bool) change to previous problem (optional)
- response: 200
    - content-type: `application/json`
    - body: object
        - _id: (string) the problem's id
        - problemName: (string) the problem's name
        - description: (string) the problem's description
        - StarterCodes: (Array) the problem's starter codes
        - correctRate: (number) the problem's average correct rate by interviewees
        - preferredLanguage: (string) the problem's most picked language by interviewees 
        - problemInputSet: (Array) the problem's input data set
        - problemOutputSet: (Array) the problem's output data set
        - problemRubric: (Array) the problem's rubric
        - comment: (string) interviewers comment on candidate's performance on this problem
        - allPassed: (bool) whether all test cases are passed
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - index should be non-negative int
        - next should be true
        - prev should be true
        - index or next or prev should be specified
- response: 404
    - content-type: `text/plain`
    - body: no specified problem available
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"index":1}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/current-problem-index/'
```

## INTERVIEW-PROBLEM

#### ANY REQUEST START WITH /api/organization/:organizationId/position/:positionId/interview/:interviewId/problem/:index/

- response: 400
    - content-type: `text/plain`
    - body: index should be non-negative integer
- response: 404
    - content-type: `text/plain`
    - body: problem index out of bound

#### PATCH /api/organization/:organizationId/position/:positionId/interview/:interviewId/problem/:index/evaluation/

- description: update the marks and comment of an interview problem
- access: is interviewer
- request: `POST /api/organization/:organizationId/position/:positionId/interview/:interviewId/current-problem-index/problem/:index/evaluation/`   
    - content-type: `application/json`
    - body: object
      - grade: object (optional)
        - idx: (int) index of grade to update
        - value: (int) value of grade to update to
      - comment: (string) comment to update to (optional)
      - allPassed: (bool) update whether the candidate passes all test cases (optional)
- response: 200
    - content-type: `application/json`
    - body: object
        - problemRubric: object
            - name: (string) name of the rubric
            - desc: (string) desc of the rubric
            - rating: (int) maximum mark of the rubric
            - curRating: (int) current mark of the rubric
        - allPassed: (bool) whether all test cases are passed
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - grade should contain idx and value
        - grade.idx should be non-negative integer
        - grade.value should be non-negative integer
        - comment should be valid string
        - allPassed should be true
- response: 404
    - content-type: `text/plain`
    - body: rubric index out of bound
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"comment":"good"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/interview/606ba8f396cf3840a4692798/problem/:index/evaluation/'
```

## INTERVIEW-ALL-POSITION

#### GET /api/organization/:organizationId/interview/

- description: get interviews of an organization
- access: is organization user
- request: `GET /api/organization/:organizationId/interview/`   
    - query parameters:
        - status: (string) only get interviews in this status (optional)
        - page: (int) page to retrieve (optional) default to 1
        - candidateContains: (string) only get interviews with candidate name having candidateContains (optional)
        - positionContains: (string) only get interviews with position name having positionContains (optional)
- response: 200
    - content-type: `application/json`
    - body: object
        - totalPage: total number of pages matching query
        - interviews: array of object
            - _id: (string) the id of the interview
            - position: object
                - _id: id of the position
                - name: name of the position
            - candidate: object
                - name: (string) name of the candidate
                - email: (string) email of the candidate
            - scheduledTime: (string) scheduled starting time of the interview
            - status: (string) the status of the interview
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/interview/'
```

## PROBLEM SET

#### Post a problem
- description: post a new problem
- access: is organization user
- request: `POST /api/organization/:organizationId/problemSet`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
    - content-type: `application/json`
    - body: object
      - problemName: (string) the problem's name
      - description: (string) the problem's description
      - StarterCodes: (Array) the problem's starter codes
      - problemInputSet: (Array) the problem's input data set
      - problemOutputSet: (Array) the problem's output data set
      - problemRubric: (Array) the problem's rubric
- response: 200
    - body: "Success"
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 406
    - body: "You have too many problems under this user! Please remove some."
- response: 409
    - body: "Problem with this name already exists"
``` 
$ curl -X POST -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       -d '{
        problemName: 'New Problem Name',
        description: '# Description \n - Markdown is supported for description!',
        StarterCodes: {
            'C++': 'class Solution {\r\n  \tpublic:\r\n \tString solve(String s) {\r\n\r\n  }\r\n}',
            Java: 'class Solution {\r\n  \tpublic String solve(String s) {\r\n\r\n  }\r\n}',      
            Python: 'class Solution:\r\n\tdef solve(self, s: str) -> str:',
            JavaScript: 'var solve = function(s) {\r\n\r\n};',
            TypeScript: 'var solve = function(s: string): string {\r\n\r\n};'
        },
        problemInputSet: [ '0\n' ],
        problemOutputSet: [ '1\n' ],
        problemRubric: []
        }'
       http://localhost:3001/api/organization/ABC/problemSet'
```

#### Update a problem
- description: update an existing problem
- access: is organization user
- request: `put /api/organization/:organizationId/problemSet`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
    - content-type: `application/json`
    - body: object
      - ID: (string) the problem's ID
      - problemName: (string) the problem's name
      - description: (string) the problem's description
      - StarterCodes: (Array) the problem's starter codes
      - correctRate: (number) the problem's average correct rate by interviewees
      - preferredLanguage: (string) the problem's most picked language by interviewees
      - problemInputSet: (Array) the problem's input data set
      - problemOutputSet: (Array) the problem's output data set
      - problemRubric: (Array) the problem's rubric
- response: 200
    - body: "Success"
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 404
    - body: "Given problem ID does not exist!"
``` 
$ curl -X PUT -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       -d '{
        ID: '606ca64021314e8494f68867',
        problemName: 'UPDATED',
        description: '# Description \n - Markdown is supported for description!',
        correctRate: 1,
        preferredLanguage:'C++', 
        StarterCodes: {
            'C++': 'class Solution {\r\n  \tpublic:\r\n \tString solve(String s) {\r\n\r\n  }\r\n}',
            Java: 'class Solution {\r\n  \tpublic String solve(String s) {\r\n\r\n  }\r\n}',      
            Python: 'class Solution:\r\n\tdef solve(self, s: str) -> str:',
            JavaScript: 'var solve = function(s) {\r\n\r\n};',
            TypeScript: 'var solve = function(s: string): string {\r\n\r\n};'
        },
        problemInputSet: [ '0\n' ],
        problemOutputSet: [ '1\n' ],
        problemRubric: []
        }'
       http://localhost:3001/api/organization/ABC/problemSet'
```

#### Update a lot of problems
- description: update some existing problems
- access: is organization user
- request: `patch /api/organization/:organizationId/problemSet`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
    - content-type: `application/json`
    - body: list of objects with:
      - ID: (string) the problem's ID
      - problemName: (string) the problem's name
      - description: (string) the problem's description
      - StarterCodes: (Array) the problem's starter codes
      - correctRate: (number) the problem's average correct rate by interviewees
      - preferredLanguage: (string) the problem's most picked language by interviewees
      - problemInputSet: (Array) the problem's input data set
      - problemOutputSet: (Array) the problem's output data set
      - problemRubric: (Array) the problem's rubric
- response: 200
    - body: "Success"
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
``` 
$ curl -X PATCH -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       -d '[{"ID":"606ca64021314e8494f68867","problemName":"UPDATED","description":"# Description \\n - Markdown is supported for description!","correctRate":1,"StarterCodes":{"C++":"class Solution {\\r\\n  \\tpublic:\\r\\n \\tString solve(String s) {\\r\\n\\r\\n  
}\\r\\n}","Java":"class Solution {\\r\\n  \\tpublic String solve(String s) {\\r\\n\\r\\n  
}\\r\\n}","Python":"class Solution:\\r\\n\\tdef solve(self, s: str) -> str:","JavaScript":"var solve = function(s) {\\r\\n\\r\\n};","TypeScript":"var solve = function(s: string): string {\\r\\n\\r\\n};"},"problemInputSet":["0\\n"],"problemOutputSet":["1\\n"],"problemRubric":[]},{"ID":"606ca64621314e8494f68869","problemName":"New Problem Name2","description":"# Description \\n - Markdown is supported for description! TEST1","correctRate":1,"StarterCodes":{"C++":"class Solution {\\r\\n  \\tpublic:\\r\\n \\tString solve(String s) {\\r\\n\\r\\n  }\\r\\n}","Java":"class Solution {\\r\\n  \\tpublic String solve(String s) {\\r\\n\\r\\n  }\\r\\n}","Python":"class Solution:\\r\\n\\tdef solve(self, s: str) -> str:","JavaScript":"var solve = function(s) {\\r\\n\\r\\n};","TypeScript":"var solve = function(s: string): string {\\r\\n\\r\\n};"},"problemInputSet":["0\\n"],"problemOutputSet":["1\\n"],"problemRubric":[]},]'
       http://localhost:3001/api/organization/ABC/problemSet'
```

#### Delete a problem
- description: delete an existing problem
- access: is organization user
- request: `delete /api/organization/:organizationId/problemSet/:problemID`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
      - problemID: the problem ID of the problem going to be deleted
- response: 200
    - body: "Deletion Success"
- response: 202
    - body: "This problem ID does not exist."
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
``` 
$ curl -X DELETE -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/123'
```

#### Get problems
- description: get problems within same organization
- access: is organization user
- request: `Get /api/organization/:organizationId/problemSet`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
    - Query:
      - pageNum: the page number of the problems, will return 10 results. if PageNum was not given or is -1, then all results will be returned.
      - Q: the query for contents. Will regex filter ID, name and description. Can be empty. Usually recommended query without page selection. 
- response: 200
    - body: List of problem objects with:
      - ID: (string) the problem's ID
      - problemName: (string) the problem's name
      - description: (string) the problem's description
      - StarterCodes: (Array) the problem's starter codes
      - correctRate: (number) the problem's average correct rate by interviewees
      - preferredLanguage: (string) the problem's most picked language by interviewees 
      - problemInputSet: (Array) the problem's input data set
      - problemOutputSet: (Array) the problem's output data set
      - problemRubric: (Array) the problem's rubric
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 404
    - body: "User's problem set does not exist!"
``` 
$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/'
$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/?pageNum=0'
$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/?Q=TEST'
$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/?pageNum=1&Q=2'
```

#### Get problem page count
- description: get problem page count
- access: is organization user
- request: `Get /api/organization/:organizationId/problemSet/pageCount`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
- response: 200
    - body: Object
      - count: (number) Total available pages
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 404
    - body: "Problem set does not exist!""
``` 

$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/pageCount'
```

#### Get a problem
- description: get a desginated problem with given ID
- access: is organization user
- request: `Get /api/organization/:organizationId/problemSet/:problemID`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
      - problemID: the problem ID of the problem
- response: 200
    - body: Object
      - ID: (string) the problem's ID
      - problemName: (string) the problem's name
      - description: (string) the problem's description
      - StarterCodes: (Array) the problem's starter codes
      - correctRate: (number) the problem's average correct rate by interviewees
      - preferredLanguage: (string) the problem's most picked language by interviewees 
      - problemInputSet: (Array) the problem's input data set
      - problemOutputSet: (Array) the problem's output data set
      - problemRubric: (Array) the problem's rubric
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 404
    - body: "Problem set does not exist!"
```
$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/123/'
```


#### Get a problem's data set
- description: get desginated problem's data set with given ID
- access: is organization user
- request: `Get /api/organization/:organizationId/problemSet/:problemID/dataset`
    - Parameters:
      - organizationId: the organizationId of the user posting this problem
      - problemID: the problem ID of the problem
- response: 200
    - body: Object
      - Input: (Array) the problem's input data set
      - Output: (Array) the problem's output data set
- response: 500
    - body: Error during database operation
- response: 403
    - body: "Not Logged in!"
- response: 404
    - body: "Problem set does not exist!""
``` 

$ curl -X GET -b cookie.txt -c cookie.txt 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/123/dataset'
```

## USER

#### GET /api/organization/:organizationId/user/

- description: get users of an organization
- access: is organization user
- request: `GET /api/organization/:organizationId/user/` 
    - query parameters
        - page: (int) page to retrieve, optional, default to 10
- response: 200
    - content-type: `application/json`
    - body: array of object
        - _id: (string) id of the user
        - username: (string) username of the user
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/user/'
```

#### ANY REQUEST START WITH /api/organization/:organizationId/user/:userId/

- response: 400
    - content-type: `text/plain`
    - body: id invalid: user
- response: 404
    - content-type: `text/plain`
    - body: user #${userId} not found for organization #${organizationId}

#### GET /api/organization/:organizationId/user/:userId/

- description: get a user
- access: is organization user
- request: `GET /api/organization/:organizationId/user/:userId/`   
- response: 200
    - content-type: `application/json`
    - body: array of object
        - _id: (string) id of the user
        - username: (string) username of the user
        - email: (string) email of the user
        - department: (string) department of the user
        - title: (string) title of the user
        - personalStatement: (string) personal statement of the user
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/user/606a8f1c5c10601d8ce3369f/'
```

#### PATCH /api/organization/:organizationId/user/:userId/

- description: update a user
- access: is the user himself/herself
- request: `PATCH /api/organization/:organizationId/user/:userId/`   
    - content-type: `application/json`
    - body: object
        - username: (string) the username of the user (optional)
        - email: (string) the email of the user (optional)
        - department: (string) department of the user (optional)
        - title: (string) title of the user (optional)
        - personalStatement: (string) personal statement of the user (optional)
- response: 200
    - content-type: `application/json`
    - body: object
      - _id: (string) the id of the user
      - the rest are the same as request body
- response: 400
    - content-type: `text/plain`
    - body: one of:
        - username should be non-empty string
        - email should be email formatted
        - department should be valid string
        - title should be valid string
        - personalStatement should be valid string
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"username":"Joe"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/user/606a8f1c5c10601d8ce3369f/'
```

#### GET /api/organization/:organizationId/user/:userId/avatar/

- description: get avatar of a user
- access: is organization user
- request: `GET /api/organization/:organizationId/user/:userId/avatar/`   
- response: 200
    - content-type: mime type of the avatar
    - body: the avatar file
- response: 404
    - content-type: `text/plain`
    - body: avatar of user #${userId} does not exist
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/user/606a8f1c5c10601d8ce3369f/avatar/'
```

#### PUT /api/organization/:organizationId/user/:userId/avatar/

- description: create or update avatar of a user
- access: is the user himself/herself
- request: `PUT /api/organization/:organizationId/user/:userId/avatar/`
    - content-type: `multipart/form-data`
    - body: form elements
      - avatar: (file) the avatar file
- response: 200
    - content-type: `text/plain`
    - body: 'avatar changed successfully'

``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: multipart/form-data" \
       -F 'title=myTitle' \
       -F 'file=@myFile.png' \
       'http://localhost:3000/api/galleries/myUsername/images/'
```

## EVENT

#### GET /api/organization/:organizationId/event/

- description: get events of an organization
- access: is the user himself/herself
- request: `GET /api/organization/:organizationId/event/`  
    - query parameters:
        - page: (int) page to retrieve
- response: 200
    - content-type: `application/json`
    - body: object
        - totalPage: total number of pages queried
        - events: array of object
            - user: object
                - _id: (string) id of the user
                - username: (string) username of the user
                - email: (string) email of the user
                - department: (string) department of the user
                - title: (string) title of the user
                - personalStatement: (string) personal statement of the user 
            - action: (string) action taken, in create, update, delete
            - itemType: (string) item type in position, interview, problem
            - item1: object presenting the position, interview or problem
                - _id: (string) id of the item
                - name: (string) name of the item
            - item2: object only used for interview to present position
                - _id: (string) id of the item
                - name: (string) name of the item
            - time: (string) time the event happened
``` 
$ curl -b cookie.txt -c cookie.txt 'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/events/'
```

## Code Execution And Testing

#### POST /api/run/:interviewId

- description: Execute code and response with result
- request: `POST /api/run/:interviewId`
    - content-type: `application/json`
    - body: object
      - language: (string) the language of the code
      - code: (string) the code to execute
- response: 200
    - content-type: `application/json`
    - body: object
      - output: (string) the output of the program
- response: 404
    - content-type: `text/plain`
    - body: Language not found
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"language":"python", "code": "print(2333)"}' \
       'http://localhost:3001/api/run/606ba8f396cf3840a4692798'
```

#### POST /api/test/:interviewId/problem/:problemId

- description: Run test on given problem and show result
- request: `/api/test/:interviewId/problem/:problemId`
    - content-type: `application/json`
    - body: object
      - language: (string) the language of the code
      - code: (string) the code to execute
- response: 200
    - content-type: `application/json`
    - body: object
      - result: (string) the result of the test (pass, fail or compiler error)
      - msg: (string) additional message about the result
- response: 500
    - content-type: `text/plain`
    - body: Data Inconsistent
- response: 404
    - content-type: `text/plain`
    - body: Language not found
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"language":"python", "code": "print(2333)"}' \
       'http://localhost:3001/api/test/606ba8f396cf3840a4692798/problem/605df608bfa5fb2020e5e324'
```
