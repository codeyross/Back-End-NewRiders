const express = require("express");
const router = express.Router();
const Day = require("../models/day-model");


function getTodaysDate() {
  let today = new Date();
  let year = today.getFullYear();
  year = year.toString();
  let month = today.getMonth();
  month = month + 1;
  month = month.toString();
  let day = today.getDate();
  day = day.toString();
 
  let date = `${month}/${day}/${year}`;
  return date;
}

router.get("/", (req, res, next) => {
   // console.log(getTodaysDate())
  Day.find({user:req.user._id})
    .then((day) => {
        res.send(day);
    })
    .catch(next);
});

router.get("/today", (req, res, next) => {
  console.log(req.user._id)
  let today = getTodaysDate()
Day.find({date:today,user:req.user._id})
  .then((day) => {
      res.send(day);
  })
  .catch(next);
});

router.get("/date/:dates", (req, res, next) => {
  let date = req.params.dates
  date = date.replaceAll('-', '/')
  // console.log(date)
Day.find({date:date,user:req.user._id})
  .then((day) => {
   //   console.log(day)
      res.send(day);

  })
  .catch(next);
});

router.get("/:id", (req, res, next) => {
    Day.find({_id: req.params.id,user:req.user._id})
    .then((day) => {
        res.send(day);
    })
    .catch(next);
});


router.post("/add", (req, res, next) => {
 // console.log(req.body)
 // req.body.owner = req.user._id ? req.user._id : req.user.id;
 
 Day.find({date: req.body.date,user:req.user._id})
    .then((day) => {
        if(day.length >0){
            res.send("Already Exists")
        }
        else{
            Day.create(req.body)
            .then((day)=>res.send(day))
            .catch(console.error);
        }
    })
    .catch(next);

 
});

router.delete("/:dayid", (req, res, next) => {
 // let owner = req.user._id ? req.user._id : req.user.id;

 Day.findOneAndDelete({ _id: req.params.dayid}, (del) => {
   // console.log(del)
    res.send(del);
  }).catch(console.error);
});

router.put("/:id", (req, res) => {
  Day.findOneAndUpdate(
    {

      _id: req.params.id,
      user:req.user._id
     // owner: req.user._id ? req.user._id : req.user.id,
    },
    req.body,
    { new: true }
  )
    .then((day) => {
   
      res.send(day);
    })
    .catch(console.error);
});
/*
router.put("/fromcustomer/:invoiceId", (req, res) => {
  Invoice.findOneAndUpdate(
    {
      _id: req.params.invoiceId,
      owner: req.user._id ? req.user._id : req.user.id,
    },
    req.body,
    { new: true }
  )
    .then((inv) => {
      generateLog(inv.owner, req.body, "Invoice updated ");

      Customer.find({
        name: inv.customer,
        owner: req.user._id ? req.user._id : req.user.id,
      }).then((customer) => {
        res.redirect(`/customers/${customer[0]._id}`);
      });
    })
    .catch(console.error);
});
*/

const dayController = router;
module.exports = dayController;