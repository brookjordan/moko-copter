const userName  = localStorage.getItem('mokoDroneUsername') || prompt('Enter your username!', '');
let highScore = localStorage.getItem('mokoDroneHiscore') ? +localStorage.getItem('mokoDroneHiscore') : 0;
localStorage.setItem('mokoDroneUsername', userName);

export default function(newHighscore) {
  if (newHighscore > +highScore) {
    localStorage.setItem('mokoDroneHiscore', newHighscore);
    const data = {
      text: `${userName} just got a new highscore of ${newHighscore}! <http://brookjordan.uk/tg/moko|Try beat them.>`,
    };

    const oReq = new XMLHttpRequest();
    oReq.open('POST', 'https://hooks.slack.com/services/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');
    oReq.send(JSON.stringify(data));

    highScore = newHighscore;
  }
};
