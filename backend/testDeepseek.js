import {processConversation}
from "./src/services/deepseekService.js";


const response =
await processConversation(
"Book a table for 5 people tomorrow at 8 PM",
"my Name is akash",
"yes"

);


console.log(response);