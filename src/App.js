import React, { useState } from "react";
import { Container, Button, Card, CardBody, CardFooter, Row, Col, CardHeader, Alert } from 'reactstrap'
import { useForm } from "react-hook-form";
function App() {
  const { register, handleSubmit, } = useForm();
  const [resposta, setResposta] = useState();
  const [mostrarResposta, setMostrarResposta] = useState(false)
  const onSubmit = data => {
    console.log("🚀 ~ file: App.js ~ line 9 ~ App ~ data", data)
    const par = Math.floor(Math.random() * 100)
    console.log("🚀 ~ file: App.js ~ line 9 ~ App ~ par", par)
    if ((par % 2) === 0) {
      setResposta(data.isso);
    } else {
      setResposta(data.aquilo);
    }
    setMostrarResposta(true);
  }
  return (
    <Container className='mb-5' fluid>
      <Card className="mt-5">
        <CardHeader className='text-center'>
          <h1>Tire sua duvida</h1>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs="12" md='4' className='text-center'>
                <input className='form-control-lg form-control' {...register('isso')} />
              </Col>
              <Col xs="12" md='4' className='d-flex justify-content-center align-items'><h1>ou</h1></Col>
              <Col xs="12" md='4' className='text-center'>
                <input className='form-control-lg form-control' {...register('aquilo')} />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button size='lg' className='w-100' color='danger'>
              <span>Pergunte!</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Row className="text-center mt-5">
        <Col>
          <Alert
            isOpen={mostrarResposta}
            color="success"
          >
            <Row>
              <Col>
                <div>
                  Sua resposta é <strong>{resposta}</strong>
                </div>
              </Col>
            </Row>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
