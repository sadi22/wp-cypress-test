// When the route changes, we need to update wp-admin's menu with the correct section & current link
export function AdminNavMenuClassChange(page, url) {
    const wpNavMenu = document.querySelector("#adminmenu");

    Array.from(wpNavMenu.getElementsByClassName("current")).forEach(function (
      item
    ) {
      item.classList.remove("current");
    });

    const submenu = Array.from(
      wpNavMenu.querySelectorAll(".wp-has-current-submenu")
    );
    submenu.forEach(function (element) {
      element.classList.remove("wp-has-current-submenu");
      element.classList.remove("wp-menu-open");
      element.classList.remove("selected");
      element.classList.add("wp-not-current-submenu");
      element.classList.add("menu-top");
    });

    const pageUrl =
      url === "/"
        ? "admin.php?page=mrm-admin"
        : "admin.php?page=mrm-admin#/" + url;
    const currentItemsSelector =
      url === "/"
        ? `li > a[href$="${pageUrl}"], li > a[href*="${pageUrl}?"]`
        : `li > a[href*="${pageUrl}"]`;
    const currentItems = wpNavMenu.querySelectorAll(currentItemsSelector);

    Array.from(currentItems).forEach(function (item) {
      item.parentElement.classList.add("current");
    });

    if (page) {
      const currentMenu = wpNavMenu.querySelector(
        "#" + "toplevel_page_mrm-admin"
      );
      if (currentMenu) {
        currentMenu.classList.remove("wp-not-current-submenu");
        currentMenu.classList.add("wp-has-current-submenu");
        currentMenu.classList.add("wp-menu-open");
        currentMenu.classList.add("current");
      }
    }

    const wpWrap = document.querySelector("#wpwrap");
    wpWrap.classList.remove("wp-responsive-open");
}

export function DateTime(create_time ,updated_time){
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthIdx = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthFullIdx = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dateFormat = new Date(updated_time);
    const createDate = new Date(create_time);

    const day = weekDay[dateFormat.getDay()];
    const month = monthIdx[dateFormat.getMonth()];
    const date = dateFormat.getDate();
    const year = dateFormat.getFullYear();
    const hour = dateFormat.getHours();
    const minute = dateFormat.getMinutes();

    const createMonth = monthFullIdx[createDate.getMonth()];
    const createDay = createDate.getDate();
    const createYear = createDate.getFullYear();
    const  DateFormat = {
        day : day,
        month : month,
        date : date,
        year : year,
        hour : hour,
        minute : minute,
        createMonth : createMonth,
        createDay : createDay,
        createYear : createYear,
    };

    return DateFormat;
}

