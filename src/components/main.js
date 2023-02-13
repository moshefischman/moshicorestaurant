import React from "react";
import { Row, Col, Button } from "reactstrap";

export default props => {
  return (
    <div>
      <Row noGutters className="text-center align-items-center tbl-cta">
        <Col>
          <p className="looking-for-tbl">
            An experience for the senses            
          </p>
          <Button
            color="none"
            className="book-table-btn"
            onClick={_ => {
              props.setPage(1);
            }}
          >
            Book a Table
          </Button>
          <Button
            color="none"
            className="book-table-btn"
            onClick={_ => {
              props.setPage(2);
            }}
          >
            Cancel Reservations
          </Button>          
        </Col>
      </Row>
      <Row noGutters className="text-center big-img-container">
        <Col>
          <img
            src={require("../images/restaurant.jpg")}
            alt="cafe"
            className="big-img"
          />
        </Col>
      </Row>
    </div>
  );
};
