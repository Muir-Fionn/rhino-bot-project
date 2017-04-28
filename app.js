const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var app = express();

var checklists = {}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


app.post("/test", function(req, res){
  console.log(req.body);
  res.send("test is working");
});

app.post("/rhinobot", function(req, res){
  res.send("Hello <@" + req.body.user_id + "|" + req.body.user_name + ">! I am a bot to help you manage your project checklist.\nTry creating a new checklist by typing `/rhinobot-newList [listname].`")
});

app.post("/rhinobot-newList", function(req, res){
  var checklistName = req.body.text;

  //Check if list already exists (must match case, may make all list names lowercase in the future)
  if(checklists.hasOwnProperty(checklistName)){
    res.send("That checklist already exists.  Please try adding again with a different name.");
  }else {
    checklists[checklistName] = {
      list: {},
      owner: "<@" + req.body.user_id + "|" + req.body.user_name + ">",
    }

    res.send("New checklist `" + checklistName + "` has been made.\nTry adding a new item by typing `/rhinobot-addItem " + checklistName + ", [itemname].`")
  }
});

app.post("/rhinobot-addItem", function(req, res){
  //Currently only adds one item at a time.  Will add multiple item capability later.
  var text = req.body.text.split(",");
  var list = text[0];
  var itemName = text[1];

  //Check if list already exists
  if(checklists[list].list.hasOwnProperty(itemName)){
    res.send("That item is already on the list.");
  }else {
    checklists[list].list[itemName] = {
      name: itemName,
      status: "incomplete",
      assignedTo: "",
      dueDate: ""
    };

    res.send("`" + itemName + "` has been added to `" + list + "`");
  }
});
