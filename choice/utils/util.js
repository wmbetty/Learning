const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const login = "https://choosen.79643.com/v1/member/login"
const ques = "https://choosen.79643.com/v1/questions/top?access-token="
const my_quest = "https://choosen.79643.com/v1/questions/my-question?access-token="
const join_quest = "https://choosen.79643.com/v1/questions/join-question?access-token="
const choose_answer = "https://choosen.79643.com/v1/watch?access-token="
const publish = "https://choosen.79643.com/v1/questions?access-token="

module.exports = {
  formatTime: formatTime,
  loginApi: login,
  questions: ques,
  my_question: my_quest,
  my_join: join_quest,
  u_answer: choose_answer,
  publishApi: publish 
}
