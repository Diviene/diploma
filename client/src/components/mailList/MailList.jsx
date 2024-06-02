import "./mailList.css"

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Берегите время, берегите деньги!</h1>
      <span className="mailDesc">Подпишитесь на рассылку и мы будем регулярно присылать вам лучшие предложения!</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Ваша почта" />
        <button>Подписаться</button>
      </div>
    </div>
  )
}

export default MailList