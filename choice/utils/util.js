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
const questop = "https://choosen.79643.com/v1/questions/top?access-token="
const noTopQues = "https://choosen.79643.com/v1/questions?access-token="
const my_quest = "https://choosen.79643.com/v1/questions/my-question?access-token="
const join_quest = "https://choosen.79643.com/v1/questions/join-question?access-token="
const choose_answer = "https://choosen.79643.com/v1/choose?access-token="
const watch_ques = "https://choosen.79643.com/v1/watch?access-token="
const publish = "https://choosen.79643.com/v1/questions?access-token="
const quesDetail = "https://choosen.79643.com/v1/questions/"
const vote_count = "https://choosen.79643.com/v1/message/vote-count?access-token="
const notice_count = "https://choosen.79643.com/v1/message/notice-count?access-token="
const notice_msg = "https://choosen.79643.com/v1/message/notice-msg?access-token="
const vote_msg = "https://choosen.79643.com/v1/message/vote-msg?access-token="
const userInfo = "https://choosen.79643.com/v1/member/user-info?access-token="
const myInfo = "https://choosen.79643.com/v1/member/info?access-token="
const othersInfo = "https://choosen.79643.com/v1/member/other-info?access-token="
const msgUnreadTotal = "https://choosen.79643.com/v1/message/total-count?access-token="
const myChooseTagApi = "https://choosen.79643.com/v1/choose/my-choose?access-token="
const readNoticeApi = "https://choosen.79643.com/v1/message/read-notice?access-token="
const readVoteApi = "https://choosen.79643.com/v1/message/read-vote?access-token="
const otherPublishQues = "https://choosen.79643.com/v1/questions/others-question?access-token="
const feedback = "https://choosen.79643.com/v1/feed?access-token="

module.exports = {
  formatTime: formatTime,
  loginApi: login,
  questions: questop,
  noTopQues: noTopQues,
  my_question: my_quest,
  my_join: join_quest,
  u_answer: choose_answer,
  publishApi: publish,
  quesDetail: quesDetail,
  voteUnreadApi: vote_count,
  noticeUnreadApi: notice_count,
  noticeMsg: notice_msg,
  voteMsg: vote_msg,
  userInfo: userInfo,
  othersInfo: othersInfo,
  msgUnreadTotal: msgUnreadTotal,
  watchQuesApi: watch_ques,
  myChooseTagApi: myChooseTagApi,
  readNoticeApi: readNoticeApi,
  readVoteApi: readVoteApi,
  otherPublishQues: otherPublishQues,
  myInfo: myInfo,
  feedback: feedback
}
