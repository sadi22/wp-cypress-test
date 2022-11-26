export default function ContactCards(props) {
  return (
    <div className="single-card">
      <div className="image-title">
        <span className="card-icon">{props.source}</span>
        <p>{props.cardTitle}</p>
      </div>
      <h3 className="total-contact-numbers">{ props.totalAmount ? props.totalAmount : "0"}</h3>
    </div>
  );
}
