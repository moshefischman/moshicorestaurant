import React from "react";
import { Row, Col } from "reactstrap";

export default _ => {
  //The reservation was made. TO DO: Send mail (not required for this test)
  return (
    <div>
      <Row noGutters className="text-center">
        <Col>
          <p className="thanks-header">Thank You!</p>
          <i className="fas fa-tbl-slice thank-you-tbl"></i>
          <p className="thanks-subtext">
            You should receive an email with the details of your reservation.
          </p>
        </Col>
      </Row>
    </div>
  );
};
