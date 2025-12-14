// criado na pasta tests/k6 usando botão direito do mouse new...

import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 10,
  //duration: '20s',
  iterations: 10,
  thresholds: {
    http_req_duration: ['p(90) <= 2', 'p(95) <= 3'], 
    http_req_failed: ['rate < 0.01']

  }
};

export default function () {
  let responseInstructorLogin = ''
  
  group('Fazendo login', () => {
    responseInstructorLogin = http.post(
      'http://localhost:3000/instructors/login',
      JSON.stringify({
        email: "leandro@leandro.com",
        password: "123456"
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })

  group('Registrando uma nova lição', () => {
    let responseLesson = http.post(
      'http://localhost:3000/lessons',
      JSON.stringify({
        title: "Aulas de como tocar Oboé",
        description: "Introdução ao Oboé"
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseInstructorLogin.json('token')}` // captura o token da resposta do login
        }
      }
    )

    check(responseLesson, {
      'Status deve ser igual a 201': (res) => res.status === 201
    })
  })

 // console.log(responseInstructorLogin.json('token')) // imprime o token da resposta do login
 // console.log(responseLesson)

 group('Simulando o pensamento do usuário', () => {
  sleep(1)
 })

}
