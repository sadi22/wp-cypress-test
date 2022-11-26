import { Link } from "react-router-dom";

export default function DashboardCard(props) {
  return (
    <div className="single-card">
      <div className="image-title">
        <span className="card-icon">{props.source}</span>
        <Link to={`${props.url}`}>
          <p>{props.cardTitle}</p>
        </Link>
      </div>
      <h3 className="total-contact-numbers">{props.totalAmount}</h3>
    </div>
  );
}
