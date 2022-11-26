import UpgradePro from "./Icons/UpgradePro";
import QuestionIcon from "./Icons/QuestionIcon";
import Search from "./Icons/Search";

export default function SearchNavbar() {
  return (
    <div className="mrm-navbar">
      <div className="mrm-search-bar">
        <Search />
        <input
          type="search"
          className="search-bar"
          placeholder="Search All Assets"
        />
      </div>
      <div className="upgraded-section">
        <span className="upgraded-to">Upgrade to</span>
        <span className="pro">Pro</span>
        <div className="go-to">
          <UpgradePro />
        </div>
        <div className="question-btn">
          <QuestionIcon />
          <span className="tooltip">Help & Resource</span>
        </div>
      </div>
    </div>
  );
}
