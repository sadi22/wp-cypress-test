import CrossIcon from "./Icons/CrossIcon";

export default function ExportDrawer(prop) {
  const { isCloseNote, setIsCloseNote } = prop;

  const closeSection = () => {
    setIsCloseNote(!isCloseNote);
  };
  return (
    <div
      class={
        prop.isOpenNote && !isCloseNote
          ? "mintmrm-export-settings-drawer show-drawer"
          : "mintmrm-export-settings-drawer"
      }
    >
      <span className="drawer-bg-overlay"></span>

      <div className="drawer-wrapper ConditionFields">
        <div className="drawer-header">
          {/* <!-- step title --> */}
          <h4 className="drawer-title">
            <span className="drawer-type">Export</span>
          </h4>

          {/* <!-- Add Condition title --> */}

          <span className="mintmrm-drawer-close" onClick={closeSection}>
            <CrossIcon />
          </span>
        </div>
        {/* <!-- /.drawer-header --> */}

        <div className="export-drawer-body">
          <div className="inner-input-section">
            <h5>Choose Fields</h5>
            <div className="body-wrapper field">
              <div className="body-title">
                <span class="mintmrm-checkbox">
                  <input type="checkbox" name="fields" id="fields" />
                  <label for="fields">Fields</label>
                  <span className="selected">{`(3 selected)`}</span>
                </span>
              </div>
              <ul className="body-section ">
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="email" id="email" />
                    <label for="email">Email</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="first-name" id="first-name" />
                    <label for="first-name">First Name</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="last-name" id="last-name" />
                    <label for="last-name">Last Name</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="list" id="list" />
                    <label for="list">List</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="tag" id="tag" />
                    <label for="tag">Tag</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="segment" id="segment" />
                    <label for="segment">Segment</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="last-activity"
                      id="last-activity"
                    />
                    <label for="last-activity">Last Activity</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="status" id="status" />
                    <label for="status">Status</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="source" id="source" />
                    <label for="source">Source</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="phone-number"
                      id="phone-number"
                    />
                    <label for="phone-number">Phone Number</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="creation-date"
                      id="creation-date"
                    />
                    <label for="creation-date">Creation Date</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="last-change"
                      id="last-change"
                    />
                    <label for="last-change">Last Change</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="address" id="address" />
                    <label for="address">Address</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="country" id="country" />
                    <label for="country">Country</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="state" id="state" />
                    <label for="state">State</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="city" id="city" />
                    <label for="city">City</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="postcode" id="postcode" />
                    <label for="postcode">Postcode</label>
                  </span>
                </li>
              </ul>
            </div>
            <div className="body-wrapper custom-field">
              <div className="body-title">
                <span class="mintmrm-checkbox">
                  <input
                    type="checkbox"
                    name="custom-field"
                    id="custom-field"
                  />
                  <label for="custom-field">Custom Field</label>
                </span>
              </div>
              <ul className="body-section custom-field">
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="preffered-delivery-time"
                      id="preffered-delivery-time"
                    />
                    <label for="preffered-delivery-time">
                      Preffered Delivery Time
                    </label>
                  </span>
                </li>
              </ul>
            </div>
            <div className="body-wrapper woocommerce">
              <div className="body-title">
                <span class="mintmrm-checkbox">
                  <input type="checkbox" name="woocommerce" id="woocommerce" />
                  <label for="woocommerce">WooCommerce</label>
                </span>
              </div>
              <ul className="body-section">
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="purchase" id="purchase" />
                    <label for="purchase">Has made a purchase</label>
                  </span>
                </li>

                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="categories" id="categories" />
                    <label for="categories">
                      Purchased Products Categories
                    </label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="count" id="count" />
                    <label for="count">Total Orders Count</label>
                  </span>
                </li>

                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="revenue" id="revenue" />
                    <label for="revenue">Total Revenue</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="first-date" id="first-date" />
                    <label for="first-date">First Order Date</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="Last-date" id="Last-date" />
                    <label for="Last-date">Last Order Date</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input
                      type="checkbox"
                      name="last-order-days"
                      id="last-order-days"
                    />
                    <label for="last-order-days">Last Order Days</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="value" id="value" />
                    <label for="value">Average Order Value</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="products" id="products" />
                    <label for="products">Purchased Products</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="coupons" id="coupons" />
                    <label for="coupons">Has used coupons</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="purchased" id="purchased" />
                    <label for="purchased">Purchased Products Tags</label>
                  </span>
                </li>
                <li>
                  <span class="mintmrm-checkbox">
                    <input type="checkbox" name="used-coupons" id="used-coupons" />
                    <label for="used-coupons">Used Coupons</label>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="body-footer">
            <button className="cancel-export mintmrm-btn outline" onClick={closeSection}>
              Cancel
            </button>
            <button type="submit" className="save-export mintmrm-btn ">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
