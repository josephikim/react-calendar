export default class userController {
  allAccess = (req, res) => {
    res.status(200).send("Public content")
  };

  userAccess = (req, res) => {
    res.status(200).send("User content")
  };

  adminAccess = (req, res) => {
    res.status(200).send("Admin content")
  };

  moderatorAccess = (req, res) => {
    res.status(200).send("Moderator content")
  };
}