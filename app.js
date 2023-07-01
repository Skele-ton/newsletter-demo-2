import express from'express';
import mailchimp from '@mailchimp/mailchimp_marketing';
import path from 'path';
import { fileURLToPath } from 'url';
 
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = 'ea47736484f69d616c7958d3dcdb9551a-us11';
const server = 'us11';
const audId = 'f769d3f524';

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
mailchimp.setConfig({
  apiKey: apiKey,
  server: server,
});
 
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});
 
app.post('/', (req, res) => {
  const { firstName, lastName, email } = req.body;
  const listId = audId;
 
  const newMember = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };
 
  const run = async () => {
    try {
      const response = await mailchimp.lists.addListMember(
        listId,
        JSON.stringify(newMember)
      );
    res.sendFile(__dirname + '/success.html');
    } catch (error) {
      const errData = JSON.parse(error.response.text);
      res.sendFile(__dirname + '/failure.html');
      console.log(errData);
    }
  };
 
  run();
});
 
app.post('/failure', (req, res) => {
  res.redirect('/');
});
 
app.listen(process.env.PORT || port, () => {
  console.log('Server is running successfully');
});
