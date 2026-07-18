import { Row, Col, Card, Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Welcome</h1>
          <p className="text-muted">
            This is the home page of your application.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>Manage application users.</Card.Text>
              <Button variant="primary">View Users</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Products</Card.Title>
              <Card.Text>Manage products and inventory.</Card.Text>
              <Button variant="success">View Products</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              <Card.Text>View customer orders.</Card.Text>
              <Button variant="warning">View Orders</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
