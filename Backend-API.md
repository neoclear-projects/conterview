# BACKEND API

## AUTH

## EDITOR

## EVENT

## EXEC

## INTERVIEW-ALL-POSITION

## INTERVIEW

## ORGANIZATION

### PROBLEM SET

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
``` 
$ curl -X POST 
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
$ curl -X PUT 
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
$ curl -X PATCH 
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
$ curl -X DELETE 
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
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/'
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/?pageNum=0'
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/?Q='
$ curl -X GET 
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

$ curl -X GET 
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
$ curl -X GET 
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

$ curl -X GET 
       -H "Content-Type: `application/json`" 
       http://localhost:3001/api/organization/ABC/problemSet/123/dataset'
```
## POSITION

## USER