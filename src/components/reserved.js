import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";


export default props => {
  const [totalTables, setTotalTables] = useState([]);

  // User's selections
  const [selection, setSelection] = useState({
    table: {
      name: null,
      id: null
    },
    date: new Date(),
    time: null,
    location: "Any Location",
    size: 0
  });

  const [times] = useState([
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM"
  ]);
  // Basic reservation "validation"
  const [cancellationError, setCancellationError] = useState(false);

  const getDate = () => {
    const months = [
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
      "December"
    ];
    const date =
      months[selection.date.getMonth()] +
      " " +
      selection.date.getDate() +
      " " +
      selection.date.getFullYear();
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
    const datetime = new Date(date + " " + time);
    return datetime;
  };

  const getNumOfReservedTables = () => {
    try {
        return totalTables.length;
    } catch (error) {
        return 0;
    }
  };

  // Generate times dropdown
  const getTimes = () => {
    let newTimes = [];
    times.forEach(time => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table
              },
              time: time
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });
    return newTimes;
  };


  useEffect(() => {
    // Check availability of tables from DB/LocalStorage/API when a date and time is selected
    if (selection.time && selection.date) {
      (async _ => {
        let datetime = getDate();
        let res = await fetch("http://localhost:3005/allreservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: datetime
          })
        });
        res = await res.json();
        // res is already filtered with all reserved tables
        if (Array.isArray(res)) {
          res = res.map(tbl => ({ ...tbl, reservationdate: datetime })); //Added selected date like extra property for possible use
          setTotalTables(res);
        }             
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.time, selection.date]);


  // Cancel the reservation if all details are filled out
  const cancelReserve = async (theDate, theTableId) => {

    let res = await fetch("http://localhost:3005/deletereserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: theDate,
        tableid: theTableId
      })
    });
    res = await res.text();
    if (res === "Reservation cancelled") {
      let newArrTbls = totalTables.filter(tbl => tbl._id !== theTableId);
      setTotalTables(newArrTbls);
    } else {
      setCancellationError(res);
    }
  };


  // Generating tables from available tables state
  const getTables = () => {
    if (getNumOfReservedTables() > 0) {
      let tables = [];
      totalTables.forEach(table => {
        tables.push(
            <Row noGutters key={table._id}>
                <Col xs="12" sm="3">{table._id}</Col>
                <Col xs="12" sm="3">{table.name} - {table.capacity} chairs - {table.location}</Col>
                <Col xs="12" sm="3">Reserved by: {table.reservation.name} -  {table.reservation.phone}</Col>
                <Col xs="12" sm="3">
                  <button
                    onClick={_ => {
                      cancelReserve(getDate(),table._id);
                    }}
                  >
                    Cancel reserve
                </button>
                </Col>
            </Row>
          );
      });
      return tables;
    }
  };

  return (
    <div>
      <Row noGutters className="text-center align-items-center tbl-cta">
        <Col>
          <p className="looking-for-tbl">
            {!selection.table.id ? "Cancel Reservations" : "Confirm Cancellation"}
            <i
              className={
                !selection.table.id
                  ? "fas fa-chair tbl-slice"
                  : "fas fa-clipboard-check tbl-slice"
              }
            ></i>
          </p>
          <p className="selected-table">
            {selection.table.id
              ? "You are cancelling table " + selection.table.name
              : null}
          </p>

          {cancellationError ? (
            <p className="reservation-error">
              * Please fill out all of the details.
            </p>
          ) : null}
        </Col>
      </Row>

      {(
        <div id="reservation-stuff">
          <Row noGutters className="text-center align-items-center">
            <Col xs="12" sm="3">
              <input
                type="date"
                required="required"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => {
                  if (!isNaN(new Date(new Date(e.target.value)))) {
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date(e.target.value)
                    };
                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table
                      },
                      date: new Date()
                    };
                    setSelection(newSel);
                  }
                }}
              ></input>
            </Col>

            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Select a Time" : selection.time}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>

          </Row>
          <Row noGutters className="tables-display">
            <Col>
              {getNumOfReservedTables() > 0 ? (
                <p className="available-tables">{getNumOfReservedTables()} reserved</p>
              ) : null}

              {selection.date && (
                getNumOfReservedTables() > 0 ? (
                  <>
                    <div className="table-key">                 
                      {getTables()}
                    </div>
                  </>
                ) : (
                  <p className="table-display-message">No Reserved Tables</p>
                )
              ) }
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
