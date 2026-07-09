import express from "express";

import {
createLiveKitToken
}
from "../services/livekitService.js";


const router = express.Router();


router.get(
"/token",
async (req,res)=>{


try {


const token =
await createLiveKitToken(
"restaurant-room",
"customer"
);


res.json({

token

});


}
catch(error){

console.error(error);

res.status(500).json({

error:error.message

});

}


});


export default router;