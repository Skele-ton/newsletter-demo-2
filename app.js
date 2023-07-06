import express from'express';
import mailchimp from '@mailchimp/mailchimp_marketing';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = 'us11';
const audId = 'f769d3f524';

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
mailchimp.setConfig({
  apiKey: process.env.KEY,
  server: server,
});
 
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
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
