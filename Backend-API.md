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
        organization is needed and should be non-empty string
        passcode is needed and should be non-empty string
        username is needed and should be non-empty string
        password is needed and should be non-empty string
        email is needed and should be email formatted
- response: 404
    - content-type: `text/plain`
    - body: organization ${organization name} does not exist
- response: 401
    - content-type: `text/plain`
    - body: wrong passcode
- response: 409
    - content-type: `text/plain`
    - body: username ${username} already exists
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
        username is needed and should be non-empty string
        password is needed and should be non-empty string
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
        id invalid: interview
        passcode is needed and should be non-empty string
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
        organization name is needed and should be non-empty string
        organization passcode is needed and should be non-empty string
- response: 409
    - content-type: `text/plain`
    - body: organization ${name} already exists
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
        position name is needed and should be non-empty string
        position description is needed and should be non-empty string
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
- request: `GET /api/organization/:organizationId/position/`   
    - query parameters:
        - page: (int) page to retrieve
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
        page should be non-negative integer
        nameContains should be non-empty string
        allFinished should be boolean
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
        position name should be non-empty string
        position description should be non-empty string
``` 
$ curl -b cookie.txt -c cookie.txt \
       -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"name":"Software Developer","descriprion":"myDescription"}' \
       'http://localhost:3001/api/organization/606a8f165c10601d8ce3369e/position/606ba42096cf3840a469278a/'
```

#### GET /api/organization/:organizationId/position/:positionId/

- description: get a position
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

- description: delete a position
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

## INTERVIEW-PROBLEM

## INTERVIEW-ALL-POSITION

## PROBLEM SET

#### Post a problem
- description: post a new problem
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

## EVENT