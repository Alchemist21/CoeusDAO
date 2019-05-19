const CoeusDAO = artifacts.require("./CoeusDAO.sol");

module.exports = function(deployer) {
  deployer.deploy(CoeusDAO);
};