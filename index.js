const CourseStatus = ["No", "Created"]
const StudentStatus = ["No", "Pending", "Registered", "PostedScore", "Passed", "Failed"]
let submitTeacherCreation = {};
let submitValidatorCreation = {};
let submitCourseCreation = {};
let getCourse = {};
let castValidatorVote = {};
let getValidatorResult = {};
let applyForCourse = {};
let registerStudent = {};
let createHaslock = {};
let publishTeacherScore = {};
let postStudentResult = {};
let getTeachersCourse = {};
let getValidatorsCourse = {};
let getStudentStatus = {};

window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    await ethereum.enable();
    const c = web3.eth.contract([ { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "studentStatus", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "applicationFunds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes32" } ], "name": "lockedFunds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" }, { "name": "", "type": "address" } ], "name": "validatorStatus", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "teachersCourses", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "courses", "outputs": [ { "name": "status", "type": "uint8" }, { "name": "publicDataURI", "type": "string" }, { "name": "courseCostPerStudent", "type": "uint256" }, { "name": "startTime", "type": "uint256" }, { "name": "numberOfWeeks", "type": "uint256" }, { "name": "maxNumberOfStudents", "type": "uint256" }, { "name": "numberRegistered", "type": "uint256" }, { "name": "numberOfNewValidators", "type": "uint256" }, { "name": "admin", "type": "address" }, { "name": "teacher", "type": "address" }, { "name": "courseFeesCollected", "type": "uint256" }, { "name": "validatorFeesCollected", "type": "uint256" }, { "name": "studentsPay", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "validatorsCourses", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "teachers", "outputs": [ { "name": "isEstablished", "type": "bool" }, { "name": "dataHash", "type": "bytes32" }, { "name": "scoreWeight", "type": "uint256" }, { "name": "currentScore", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "validators", "outputs": [ { "name": "isEstablished", "type": "bool" }, { "name": "dataHash", "type": "bytes32" }, { "name": "publicDataURI", "type": "string" }, { "name": "successfulValidationsCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "studentsCourses", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "dataHash", "type": "bytes32" } ], "name": "createTeacher", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "dataHash", "type": "bytes32" }, { "name": "publicDataURI", "type": "string" } ], "name": "createValidator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "dataHash", "type": "bytes32" }, { "name": "publicDataURI", "type": "string" }, { "name": "courseCostPerStudent", "type": "uint256" }, { "name": "startTime", "type": "uint256" }, { "name": "numberOfWeeks", "type": "uint256" }, { "name": "maxNumberOfStudents", "type": "uint256" } ], "name": "createCourse", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" }, { "name": "approved", "type": "bool" } ], "name": "castValidatorVote", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "courseID", "type": "bytes32" } ], "name": "getCourseValidations", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" } ], "name": "getValidatorResult", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" } ], "name": "applyForCourse", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" }, { "name": "student", "type": "address" } ], "name": "registerStudent", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" } ], "name": "withdrawApplicationFees", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" }, { "name": "score", "type": "uint256" }, { "name": "hashLock", "type": "bytes32" } ], "name": "postTeacherScore", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "courseID", "type": "bytes32" }, { "name": "student", "type": "address" }, { "name": "secretHash", "type": "bytes32" }, { "name": "passed", "type": "bool" } ], "name": "postStudentResult", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]).at('0x754f14881d487c850955f2cce9cef42539fc7ea1')
    submitTeacherCreation = () => {
      const fname = document.forms["createTeacher"]["fname"].value
      const lname = document.forms["createTeacher"]["lname"].value
      const email = document.forms["createTeacher"]["email"].value
      const dID = web3.sha3(fname + " " + lname + " " + email);
      c.createTeacher.sendTransaction(dID, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
      return false;
    }
    submitValidatorCreation = () => {
      const fname = document.forms["createValidator"]["fname"].value
      const lname = document.forms["createValidator"]["lname"].value
      const email = document.forms["createValidator"]["email"].value
      const dID = web3.sha3(fname + " " + lname + " " + email);
      const url = "https://validator.com"
      c.createValidator.sendTransaction(dID, url, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
      return false;
    }
    submitCourseCreation = () => {
      const description = document.forms["createCourse"]["description"].value
      const label = document.forms["createCourse"]["subject"].value
      const dID = web3.sha3(label + " " + description);
      const url = document.forms["createCourse"]["url"].value
      const cost = document.forms["createCourse"]["cost"].value
      const startTime = Date.parse(document.forms["createCourse"]["starttime"].value) / 1000
      const numberOfWeeks = document.forms["createCourse"]["weeks"].value
      const maxStudents = document.forms["createCourse"]["maxstudents"].value
      const sendValue = cost * maxStudents;
      c.createCourse.sendTransaction(dID, url, cost, startTime, numberOfWeeks, maxStudents, {
        from: web3.eth.accounts[0],
        value: sendValue
      },(e,h)=>{console.log(h)})
      return false
    }
    castValidatorVote = () => {
      let id = document.getElementById("hashID").innerHTML
      const radios = document.getElementsByName('decision');
      const vote = radios[0].checked
      c.castValidatorVote.sendTransaction(id, vote, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
      return false
    }
    getValidatorResult = () => {
      const description = "Danerys"//document.forms["teacherCreation"]["fname"]
      const label = "English"
      const dID = web3.sha3(label + " " + description);
      c.getValidatorResult.sendTransaction(dID, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
    }
    applyForCourse = () => {
      const label = document.forms["getACourse"]["label"].value
      const description = document.forms["getACourse"]["description"].value
      const dID = web3.sha3(label + " " + description);
      c.applyForCourse.sendTransaction(dID, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
    }
    registerStudent = () => {
      let student = document.forms["registerAStudent"]["student"].value
      let id = document.getElementById("hashID").innerHTML
      c.registerStudent.sendTransaction(id, student, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
      return false
    }
    createHashlock = () => {
      let secret = document.forms["hashlock"]["secret"].value
      const radios = document.getElementsByName('decision');
      const pass = radios[0].checked
      let secretHash = web3.sha3(secret);
      if(pass){
        secretHash = web3.sha3(secretHash+'01', {encoding: 'hex'})
      } else {
        secretHash = web3.sha3(secretHash+'00', {encoding: 'hex'})
      }
      document.getElementById("secretHash").innerHTML = secretHash;
      return false;
    }
    publishTeacherScore = () => {
      const label = document.forms["scoreTeacher"]["label"].value
      const description = document.forms["scoreTeacher"]["description"].value
      const dID = web3.sha3(label + " " + description);
      const score = document.forms["scoreTeacher"]["score"].value;
      const hashLock = document.forms["scoreTeacher"]["hash"].value
      c.postTeacherScore.sendTransaction(dID, score, hashLock, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
      return false
    }
    postStudentResult = () => {
      const label = document.forms["revealGrade"]["label"].value
      const description = document.forms["revealGrade"]["description"].value
      const dID = web3.sha3(label + " " + description);
      const student = document.forms["revealGrade"]["student"].value
      let secret = document.forms["revealGrade"]["secret"].value
      const radios = document.getElementsByName('decision');
      const pass = radios[0].checked
      let secretHash = web3.sha3(secret);
      c.postStudentResult.sendTransaction(dID, student, secretHash, pass, {
        from: web3.eth.accounts[0]
      },(e,h)=>{console.log(h)})
    }
    getCourse = (getID) => {
      let label = ""
      let description = ""
      let dID = ""
      if(getID){
        dID = getID
      } else {
        label = document.forms["getACourse"]["label"].value
        description = document.forms["getACourse"]["description"].value
        dID = web3.sha3(label + " " + description);
      }
      c.courses.call(dID,(e,r)=>{
        let ct = {
          status: CourseStatus[r[0].toFixed()],
          dataURI: r[1],
          courseCostPerStudent: r[2].toString(),
          startTime: new Date(r[3].toNumber() * 1000).toDateString(),
          numberOfWeeks: r[4].toString(),
          maxNumberOfStudents: r[5].toString(),
          numberRegistered: r[6].toString(),
          numberOfNewValidators: r[7].toString(),
          admin: r[8],
          teacher: r[9],
          courseFeesCollected: r[10].toString(),
          validatorFeesCollected: r[11].toString(),
          studentsPay: r[12]
        }
        c.getCourseValidations.call(dID,(er,re)=>{
          ct.approvals = re[0].toString()
          ct.denials = re[1].toString()
          document.getElementById("status").innerHTML = "Status: "+ct.status;
          document.getElementById("dataURI").innerHTML = "URI: "+ct.dataURI;
          document.getElementById("courseCostPerStudent").innerHTML = "Cost Per Student: "+ct.courseCostPerStudent;
          document.getElementById("startTime").innerHTML = "Start Date: "+ct.startTime;
          document.getElementById("maxNumberOfStudents").innerHTML = "Maximum Number of Students: "+ct.maxNumberOfStudents;
          document.getElementById("numberOfWeeks").innerHTML = "Number of Weeks: "+ct.numberOfWeeks;
          document.getElementById("teacher").innerHTML = "Teacher Address ID: "+ct.teacher;
          document.getElementById("hashID").innerHTML = dID;
          if(document.getElementById("validations")){
            document.getElementById("validations").innerHTML = "Validations: "+ct.approvals;
            document.getElementById("denials").innerHTML = "Denials: "+ct.denials;
            document.getElementById("registered").innerHTML = "Number of Registered Students: "+ct.numberRegistered;
          }
        })
      })
      return false
    }
    getTeachersCourse = () => {
      c.teachersCourses.call(web3.eth.accounts[0],(e,r)=>{
        getCourse(r)
      })
      return false
    }
    getValidatorsCourse = () => {
      c.validatorsCourses.call(web3.eth.accounts[0],(e,r)=>{
        getCourse(r)
      })
      return false
    }
    getStudentStatus = () => {
      let student = web3.eth.accounts[0]
      const label = document.forms["getACourse"]["label"].value
      const description = document.forms["getACourse"]["description"].value
      const dID = web3.sha3(label + " " + description);
      c.studentStatus.call(dID, student, (e,r)=>{
        document.getElementById("student").innerHTML = "Status: "+StudentStatus[r.toFixed()]
      })
      return false
    }
    //submitTeacherCreation()
    //submitValidatorCreation()
    //submitCourseCreation()
    //getCourse()
    //castValidatorVote()
    //getValidatorResult()
    //applyForCourse()
    //registerStudent()
    //createHashlock()
    //postTeacherScore()
    //postStudentResult()
  }
})