<template>
  <div id="app">
    <h2>Vote pour l'élection du maire&nbsp;:</h2>
    <p>Pour chaque candidat, donne ton avis&nbsp;:</p>
    <table class="voting_table">
      <tbody>
        <tr>
          <td></td>
          <th v-for="v in votes" :key="'v' + v.value" vhtml="v.label" class="vote_column">{{v.label}}</th>
        </tr>
        <tr v-for="c in candidates" :key="'cand' + c.id_candidate">
          <th class="candidate">{{c.name}}</th>
          <td v-for="v in votes" :key="'cand_' + c.id_candidate + '_v_' + v.value" class="vote_column"><input type="radio" v-model="c.note" :value="v.value" :id="'cand_' + c.id_candidate + '_v_' + v.value" class="vote"><label :for="'cand_' + c.id_candidate + '_v_' + v.value"></label></td>
        </tr>
      </tbody>
    </table>
    <div class="send">
      <p><label>Ton pseudo (ton vrai pseudo, merci c:) :<br><input type="text" v-model="nickname" class="nickname"></label></p>
      <button @click="vote()">Soumettre mon vote</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
      return {
          candidates: [],
          votes: [
            {label:'Excellent', value:7},
            {label:'Très bien', value:6},
            {label:'Bien', value:5},
            {label:'Assez bien', value:4},
            {label:'Passable', value:3},
            {label:'Insuffisant', value:2},
            {label:'À rejeter', value:1}
          ],
          nickname: ''
      }
  },
  methods: {
    vote: function () {
      if (!this.nickname) {
        alert('Tu dois donner ton pseudo !');
        return;
      }
      this.candidates.find(function (c) {
        if (!c.note) {
          alert('Tu dois noter tous les candidats !');
          return c;
        }
      });
      if (confirm('Envoyer le vote ?')) {
        var self = this;
        axios.post(
          this.$serv + 'xmlhttp.php',
          {
            votes: self.candidates,
            operation: 'vote',
            nickname: self.nickname
          }
        ).then(function (response) {
          if (response.data.message) {
            alert(response.data.message);
          }
          if (response.data.error > 0) {
            return;
          }
          self.nickname = '';
          self.candidates = [];
        }).catch(function (error) {
          console.log(error)
        });
      }
    }
  },
    mounted() {
      var self = this;
        axios.post(
          this.$serv + 'xmlhttp.php',
          {
            operation: 'get_candidates'
          }
        ).then(function (response) {
          response.data.candidates = response.data.candidates.map(function (c) {
            c.note = '';
            return c;
          });
          self.candidates = response.data.candidates;
        }).catch(function (error) {
          console.log(error)
        });
    }
}
</script>

<style>
html {
  background-color:#181818;
  color:#bfc4c5;
  font-family:Helvetica;
  font-size:1.1em;
  line-height: 1.5;
  text-align:center;
}
body {
  padding:2em 0;
  margin:auto;
}
.author {
  display:inline-block;
  width:100%;
  text-align:right;
}
.added {
  color:#57da8c;
}
.deleted {
    color: rgba(255, 255, 255, 0.16);
}
.speecher {
  color:#cc7f3b;
}
.speech {
    border: 1px solid #4a4646;
    padding: 2%;
    margin: 6rem 0 0;
    border-radius: 10px;
}
@media screen and (max-width:1000px) {
  body {
    width:94%;
  }
}
/* --------------------------------- */
.voting_table {
  margin:auto;
}
td, th {
  padding:0;
  white-space: nowrap;
}
td {
  font-size:0;
}
.vote {
  position:absolute;
  left:-9999px;
}
.vote + label {
  position:relative;
  display:inline-block;
  width:120px;
  height:50px;
  background-color:rgba(255,255,255,0.2);
  cursor:pointer;
  transition: background 0.5s;
}
.vote + label:before {
  content:'';
  position:absolute;
  width:16px;
  height:16px;
  border:1px solid rgba(255, 255, 255, 0.4);
  border-radius:50%;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%) rotate(90deg);
}
.vote:checked + label {
  background-color:rgba(4, 99, 177, 0.842);
}
.vote:checked + label:before {
  content:':)';
  font-size:20px;
  border:none;
  left:56%;
}
.candidate {
  text-align:right;
  padding:0 10px;
}
.send {
  margin-top:50px;
}
button {
  cursor:pointer;
}
.nickname {
  font-size:20px;
  margin-left:5px;
}
button {
  margin-top:10px;
  padding:5px 10px;
  background-color:rgba(4, 99, 177, 0.842);
  border:none;
  border-radius:4px;
  color:white;
  font-size:16px;
}
</style>
