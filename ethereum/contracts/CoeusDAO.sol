pragma solidity >=0.5.0 <0.7.0;

import "./SafeMath.sol";

contract CoeusDAO {
  using SafeMath for uint256;

  enum CourseStatus { No, Created }
  enum StudentStatus { No, Pending, Registered, PostedScore, Passed, Failed }
  enum ValidatorStatus { No, Selected, Approved, NotApproved, Collected }

  struct Course {
    CourseStatus status;
    string publicDataURI;
    uint256 courseCostPerStudent;
    uint256 startTime;
    uint256 numberOfWeeks;
    uint256 maxNumberOfStudents;
    uint256 numberRegistered;
    uint256[2] approvedNotApproved;
    uint256 numberOfNewValidators;
    address payable admin;
    address payable teacher;
    uint256 courseFeesCollected;
    uint256 validatorFeesCollected;
    bool studentsPay;
  }
  mapping(bytes32 => Course) public courses;
  mapping(bytes32 => mapping(address => uint256)) public applicationFunds;
  mapping(bytes32 => mapping(bytes32 => uint256)) public lockedFunds;
  mapping(bytes32 => mapping(address => StudentStatus)) public studentStatus;
  mapping(bytes32 => mapping(address => ValidatorStatus)) public validatorStatus;


  struct Validator {
    bool isEstablished;
    bytes32 dataHash;
    string publicDataURI;
    uint256 successfulValidationsCount;
  }
  mapping(address => Validator) public validators;
  mapping(address => bytes32) public validatorsCourses;
  address[] globalValidatorPool;

  struct Teacher {
    bool isEstablished;
    bytes32 dataHash;
    uint256 scoreWeight;
    uint256 currentScore;
  }
  mapping(address => Teacher) public teachers;
  mapping(address => bytes32) public teachersCourses;

  mapping(address => bytes32) public studentsCourses;

  modifier onlyCourseAdmin(address _sender, bytes32 courseID) {
    require(courses[courseID].admin == _sender, "Only course admin can whitelist student.");
    _;
  }
  modifier onlyCourseValidator(address _sender, bytes32 courseID) {
    require(validatorStatus[courseID][_sender] == ValidatorStatus.Selected, "Only selected validator can validate.");
    _;
  }
  modifier onlyPendingStudent(address student, bytes32 courseID) {
    require(studentStatus[courseID][student] == StudentStatus.Pending, "Only pending students can register.");
    _;
  }
  modifier onlyAfterValidation(bytes32 courseID) {
    require(
      (courses[courseID].approvedNotApproved[0].add(courses[courseID].approvedNotApproved[1]) > 3),
      "All votes not acquired.");
      _;
  }
  modifier onlyRegisteredStudent(address _sender, bytes32 courseID) {
    require(studentStatus[courseID][_sender] == StudentStatus.Registered, "Only pending students can register.");
    _;
  }
  modifier onlyFinishedStudent(address student, bytes32 courseID) {
    require(studentStatus[courseID][student] == StudentStatus.PostedScore, "Only students with a posted score can be finished.");
    _;
  }
  modifier onlyBeforeStart(bytes32 courseID) {
    require(now < courses[courseID].startTime, "Cannot do this after the course starts.");
    _;
  }
  modifier onlyAfterEnd(bytes32 courseID) {
    require(now >= (courses[courseID].startTime + (courses[courseID].numberOfWeeks * 1 weeks)),
      "Cannot do this after the course starts."
    );
    _;
  }

  function createTeacher(bytes32 dataHash) external {
    require(!teachers[msg.sender].isEstablished, "Teacher already exists.");
    teachers[msg.sender].isEstablished = true;
    teachers[msg.sender].dataHash = dataHash;
  }

  function createValidator(bytes32 dataHash, string calldata publicDataURI) external {
    require(!validators[msg.sender].isEstablished, "Validator already exists.");
    validators[msg.sender].isEstablished = true;
    validators[msg.sender].dataHash = dataHash;
    validators[msg.sender].publicDataURI = publicDataURI;
    globalValidatorPool.push(msg.sender);
  }

  function createCourse(
    bytes32 dataHash,
    string calldata publicDataURI,
    uint256 courseCostPerStudent,
    uint256 startTime,
    uint256 numberOfWeeks,
    uint256 maxNumberOfStudents)
    external
    payable
  {
    require(teachers[msg.sender].isEstablished, "Teacher not created.");
    require(globalValidatorPool.length >= 5, "Validators not established.");
    require(courses[dataHash].status == CourseStatus.No, "Course already established.");

    uint256 totalCourseCost = maxNumberOfStudents.mul(courseCostPerStudent);
    uint256 totalValidationFee = totalCourseCost.mul(5) / 100;
    require(msg.value >= totalValidationFee, "Need to deposit funds.");

    courses[dataHash] = Course({
      status: CourseStatus.Created,
      courseCostPerStudent: courseCostPerStudent,
      publicDataURI: publicDataURI,
      startTime: startTime,
      numberOfWeeks: numberOfWeeks,
      maxNumberOfStudents: maxNumberOfStudents,
      numberRegistered: 0,
      admin: msg.sender,
      teacher: msg.sender,
      courseFeesCollected: 0,
      validatorFeesCollected: msg.value,
      approvedNotApproved: [uint256(0),uint256(0)],
      numberOfNewValidators: 0,
      studentsPay: false
    });

    if((teachers[msg.sender].currentScore >= 3) || (teachers[msg.sender].scoreWeight >= 10)){
      courses[dataHash].studentsPay = true;
    }

    for (uint count = 0; count < 5; count++) {
      validatorStatus[dataHash][globalValidatorPool[count]] = ValidatorStatus.Selected;
      validatorsCourses[globalValidatorPool[count]] = dataHash;
      if(validators[globalValidatorPool[count]].successfulValidationsCount < 10){
        courses[dataHash].numberOfNewValidators++;
      }
    }

    teachersCourses[msg.sender] = dataHash;
  }

  function castValidatorVote(bytes32 courseID, bool approved)
    external
    onlyCourseValidator(msg.sender, courseID)
    onlyBeforeStart(courseID)
  {
    if(approved){
      courses[courseID].approvedNotApproved[0]++;
      validatorStatus[courseID][msg.sender] = ValidatorStatus.Approved;
    } else {
      courses[courseID].approvedNotApproved[1]++;
      validatorStatus[courseID][msg.sender] = ValidatorStatus.NotApproved;
    }
  }

  function getCourseValidations(bytes32 courseID) external view returns (uint256, uint256) {
    return (courses[courseID].approvedNotApproved[0], courses[courseID].approvedNotApproved[1]);
  }

  function getValidatorResult(bytes32 courseID)
    external
    onlyAfterValidation(courseID)
  {
    require(
      (courses[courseID].approvedNotApproved[0] > 3) ||
      (courses[courseID].approvedNotApproved[1] > 3),
      "Required votes not acquired yet.");
    uint256 allocatedForValidator;
    if((courses[courseID].approvedNotApproved[0] > 3) && (validatorStatus[courseID][msg.sender] == ValidatorStatus.Approved)){
      allocatedForValidator = courses[courseID].validatorFeesCollected / (courses[courseID].approvedNotApproved[0] - courses[courseID].numberOfNewValidators);
      validatorStatus[courseID][msg.sender] = ValidatorStatus.Collected;
      validators[msg.sender].successfulValidationsCount++;
    }
    if((courses[courseID].approvedNotApproved[1] > 3) && (validatorStatus[courseID][msg.sender] == ValidatorStatus.NotApproved)){
      allocatedForValidator = courses[courseID].validatorFeesCollected / (courses[courseID].approvedNotApproved[1] - courses[courseID].numberOfNewValidators);
      validatorStatus[courseID][msg.sender] = ValidatorStatus.Collected;
      validators[msg.sender].successfulValidationsCount++;
    }
    msg.sender.transfer(allocatedForValidator);
  }

  function applyForCourse(bytes32 courseID)
    external
    payable
    onlyBeforeStart(courseID)
    onlyAfterValidation(courseID)
  {
    require(studentStatus[courseID][msg.sender] == StudentStatus.No, "Student already applied.");
    if(courses[courseID].studentsPay){
      require(msg.value == (courses[courseID].courseCostPerStudent.mul(50) / 100), "Need to pay the proper course fee.");
    } else {
      require(msg.value == 0, "Course not authorized for payment.");
    }
    studentStatus[courseID][msg.sender] = StudentStatus.Pending;
    applicationFunds[courseID][msg.sender] = msg.value;
  }

  function registerStudent(bytes32 courseID, address student)
    external
    onlyCourseAdmin(msg.sender, courseID)
    onlyPendingStudent(student, courseID)
  {
    require(studentStatus[courseID][student] == StudentStatus.Pending, "Student already registered.");
    require((courses[courseID].numberRegistered + 1) < courses[courseID].maxNumberOfStudents, "Cannot exceed the maximum.");
    studentStatus[courseID][student] = StudentStatus.Registered;
    courses[courseID].numberRegistered++;
    studentsCourses[student] = courseID;
    if(courses[courseID].studentsPay){
      uint256 teacherAllocation = applicationFunds[courseID][student];
      applicationFunds[courseID][student] = 0;
      studentStatus[courseID][msg.sender] = StudentStatus.Registered;
      courses[courseID].courseFeesCollected = teacherAllocation;
    }
  }

  function withdrawApplicationFees(bytes32 courseID)
    external
    onlyCourseAdmin(msg.sender, courseID)
  {
    require(courses[courseID].studentsPay, "Teachers can only withdraw if students are paying.");
    uint256 allocatedForTeacher = courses[courseID].courseFeesCollected;
    courses[courseID].courseFeesCollected = 0;
    msg.sender.transfer(allocatedForTeacher);
  }

  function postTeacherScore(bytes32 courseID, uint256 score, bytes32 hashLock)
    external
    payable
    onlyRegisteredStudent(msg.sender, courseID)
    //onlyAfterEnd(courseID)
  {
    if(courses[courseID].studentsPay){
      require(msg.value == (courses[courseID].courseCostPerStudent.mul(50) / 100), "Need to pay the proper course fee.");
    } else {
      require(msg.value == 0, "Course not authorized for payment.");
    }
    if(teachers[courses[courseID].teacher].currentScore == 0){
      teachers[courses[courseID].teacher].currentScore = score;
      teachers[courses[courseID].teacher].scoreWeight++;
    } else {
      uint256 weightedAvg = teachers[courses[courseID].teacher].scoreWeight.mul(teachers[courses[courseID].teacher].currentScore);
      teachers[courses[courseID].teacher].currentScore = (weightedAvg.add(score)).mul(50) / 100;
      teachers[courses[courseID].teacher].scoreWeight++;
    }
    uint256 teacherAllocation = msg.value;
    lockedFunds[courseID][hashLock] = teacherAllocation;
    studentStatus[courseID][msg.sender] = StudentStatus.PostedScore;
  }

  function postStudentResult(bytes32 courseID, address student, bytes32 secretHash, bool passed)
    external
    onlyCourseAdmin(msg.sender, courseID)
    onlyFinishedStudent(student, courseID)
  {
    if(passed){
      studentStatus[courseID][student] = StudentStatus.Passed;
    } else {
      studentStatus[courseID][student] = StudentStatus.Failed;
    }
    uint256 fundsToSend = lockedFunds[courseID][keccak256(abi.encodePacked(secretHash, passed))];
    lockedFunds[courseID][keccak256(abi.encodePacked(secretHash, passed))] = 0;
    msg.sender.transfer(fundsToSend);
  }
}
