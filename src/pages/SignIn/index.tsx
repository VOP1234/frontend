import React, { useRef, useCallback } from 'react'
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidadtionsErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, AnimationContainer, Background } from "./styles";

interface SingInFormData {
  email: string,
  password: string
}

const SingnIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const { singIn } = useAuth()
  const { addToast } = useToast()

  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatorio.')
            .email('Digite um e-mail valido.'),
          password: Yup.string().required('Senha obrigatória.')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await singIn({
          email: data.email,
          password: data.password
        })

        history.push('/dashboard')

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidadtionsErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        })
      }
    }, [singIn, addToast, history])

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Logon</h1>
            <Input name="email" type="text" icon={FiMail} placeholder="E-mail" />
            <Input name="password" type="password" icon={FiLock} placeholder="Senha" />

            <Button type="submit">Entrar</Button>

            <a href="forgot">Esqueci minha Senha</a>
          </Form>
          <Link to="/signup">
            <FiLogIn />
          Criar conta
        </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}


export default SingnIn