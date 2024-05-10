const axios = require("axios");
const tracksArray = [
  { track: "Ahe's My Kind Of Girl" },
  { track: "Andante, Andante" },
  { track: "As Good As New" },
  { track: "Bang" },
  { track: "Bang-A-Boomerang" },
  { track: "Burning My Bridges" },
  { track: "Cassandra" },
  { track: "Chiquitita" },
  { track: "Crazy World" },
  { track: "Crying Over You" },
  { track: "Dance" },
  { track: "Dancing Queen" },
  { track: "Disillusion" },
  { track: "Does Your Mother Know" },
  { track: "Dream World" },
  { track: "Dum Dum Diddle" },
  { track: "Eagle" },
  { track: "Every Good Man" },
  { track: "Fernando" },
  { track: "Fernando (In Spanish)" },
  { track: "Free As A Bumble Bee" },
  { track: "From A Twinkling Star To A Passing Angel" },
  { track: "Gimme Gimme Gimme" },
  { track: "Givin' A Little Bit More" },
  { track: "Gonna Sing You My Lovesong" },
  { track: "Hamlet III" },
  { track: "Happy Hawaii" },
  { track: "Happy New Year" },
  { track: "He Is Your Brother" },
  { track: "Head Over Heels" },
  { track: "Here We'll Stay" },
  { track: "Hey Hey Helen" },
  { track: "Hole In Your Soul" },
  { track: "Honey, Honey" },
  { track: "I Am Just A Girl" },
  { track: "I Am The City" },
  { track: "I Do, I Do, I Do, I Do, I Do" },
  { track: "I Have A Dream" },
  { track: "I Let The Music Speak" },
  { track: "I Saw It In The Mirror" },
  { track: "I Wonder (Departure)" },
  { track: "I Wonder (Departure) [Live]" },
  { track: "If It Wasn't For The Nights" },
  { track: "I'm A Marionette" },
  { track: "I've Been Waiting For You" },
  { track: "Juper Jrouper" },
  { track: "Just A Notion" },
  { track: "King Kong Song" },
  { track: "Kisses Of Fire" },
];

let newArray = [];
let newArray2 = [];

const eachElemFunc = async (e) => {
  const response = await axios.get(
    `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${e.track}&api_key=de2d9ab525714a1142e198db09a379bc&format=json`
  );
  const { track } = response.data.results.trackmatches;
  track.forEach((er) => {
    newArray.push({ track: er.name, artist: er.artist });
  });
};

const eachElemFuncFinal = async (e) => {
  try{
    const response = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=de2d9ab525714a1142e198db09a379bc&track=${e.track}&format=json&artist=${e.artist}`
    );
    const { tag } = response.data.track.toptags;
    const titleObj = {
      track: e.track,
      artist: e.artist,
      tags : []
    };
    for(let i =0; i < tag.length; i++){
      titleObj.tags.push(tag[i].name)
    }
    newArray2.push(titleObj);
  }
  catch(e){
    console.log(e.msg);
  }
};

let sampleArray = [{ track: "One Love" }];

const createData = async (tracksArray) => {
  for (let i = 0; i < tracksArray.length; i++) {
    await eachElemFunc(tracksArray[i]);
  }
};

const finalData = async () => {
  for (let i = 0; i < newArray.length; i++) {
    await eachElemFuncFinal(newArray[i]);
  }
};

const func = async () => {
  await createData(sampleArray);
  await finalData();
  console.log(newArray2);
};

func();
