import React, { useState } from "react";
import {
  Container,
  Label,
  Button,
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  CardHeader,
  Alert,
} from "reactstrap";
import { useForm } from "react-hook-form";
function App() {
  const { register, handleSubmit } = useForm();
  const [resposta, setResposta] = useState();
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [inputs, setInputs] = useState([
    { label: "Opção 1", id: "1" },
    { label: "Opção 2", id: "2" },
  ]);

  const onSubmit = (data) => {
    if (verificarSeTodosInputsEstaoPreenchidos(data)) {
      const par = Math.floor(Math.random() * inputs.length);
      setResposta(data[`${par + 1}`]);
      setMostrarResposta(true);
    }
  };

  const adicionarMaisInputs = () => {
    setInputs([
      ...inputs,
      { label: `Opção ${inputs.length + 1}`, id: `${inputs.length + 1}` },
    ]);
  };

  const verificarSeTodosInputsEstaoPreenchidos = (data) => {
    let todosInputsEstaoPreenchidos = true;
    inputs.forEach((input) => {
      if (!data[input.id]) {
        todosInputsEstaoPreenchidos = false;
      }
    });
    return todosInputsEstaoPreenchidos;
  };

  return (
    <Container className="mb-5" fluid>
      <Card className="mt-5">
        <CardHeader className="text-center">
          <h1>Tire sua duvida</h1>
          <button
            type="button"
            onClick={adicionarMaisInputs}
            className="btn btn-outline-primary"
          >
            + Adicionar opção
          </button>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Row className="d-flex justify-content-center align-items-center">
              {inputs.map((input, index) => {
                return (
                  <>
                    <Col xs="12" md="4" className="text-center" key={index}>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="floatingInput"
                          {...register(input.id)}
                        ></input>
                        <label for="floatingInput">{input.label}</label>
                      </div>
                    </Col>
                  </>
                );
              })}
            </Row>
          </CardBody>
          <CardFooter>
            <Button size="lg" className="w-100" color="danger">
              <span>Pergunte!</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Row className="text-center mt-5">
        <Col>
          <Alert isOpen={mostrarResposta} color="success">
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
