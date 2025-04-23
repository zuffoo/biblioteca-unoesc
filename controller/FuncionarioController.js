import Funcionario from '../model/FuncionarioModel.js';
import bcrypt from 'bcryptjs'; // bcrypt para criptografia

async function listar(req, res) {
    const respostaBanco = await Funcionario.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Funcionario.findByPk(id);
    if (respostaBanco) {
        res.json(respostaBanco);
    } else {
        res.status(404).json({ erro: 'Funcionário não encontrado' });
    }
}

async function inserir(req, res) {
    const { nomefuncionario, cpf, email, telefone, nascimento, salario, contratacao } = req.body;

    if (!nomefuncionario || !email || !salario || !contratacao) {
        return res.status(400).json({ erro: 'Os campos nomefuncionario, email, salario e contratacao são obrigatórios' });
    }

    try {
        const novoFuncionario = await Funcionario.create({
            nomefuncionario,
            cpf,
            email,
            telefone,
            nascimento,
            salario,
            contratacao
        });
        res.status(201).json(novoFuncionario);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao inserir funcionário', detalhes: erro.message });
    }
}

async function alterar(req, res) {
    const { nomefuncionario, cpf, email, telefone, nascimento, salario, contratacao } = req.body;
    const idfuncionario = req.params.id;

    if (!nomefuncionario || !email || !salario || !contratacao) {
        return res.status(400).json({ erro: 'Os campos nomefuncionario, email, salario e contratacao são obrigatórios' });
    }

    try {
        const funcionario = await Funcionario.findByPk(idfuncionario);
        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        await funcionario.update({
            nomefuncionario,
            cpf,
            email,
            telefone,
            nascimento,
            salario,
            contratacao
        });

        res.json(funcionario);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao alterar funcionário', detalhes: erro.message });
    }
}

async function demitir(req, res) {
    const idfuncionario = req.params.id;
    const { demissao } = req.body;

    try {
        const funcionario = await Funcionario.findByPk(idfuncionario);
        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        if (!demissao) {
            return res.status(400).json({ erro: 'A data de demissão é obrigatória' });
        }

        await funcionario.update({ ativo: false, demissao });

        res.json({ mensagem: 'Funcionário demitido com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao demitir funcionário', detalhes: erro.message });
    }
}

async function definirSenha(req, res) {
    const idfuncionario = req.params.id;
    const { senha } = req.body;

    if (!senha || senha.length < 6 || senha.length > 20) {
        return res.status(400).json({ erro: 'A senha deve ter entre 6 e 20 caracteres' });
    }

    try {
        const funcionario = await Funcionario.findByPk(idfuncionario);
        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        // criptografando a senha antes de salvar
        const senhaCriptografada = bcrypt.hashSync(senha, 10); 

        await funcionario.update({ senha: senhaCriptografada });

        res.json({ mensagem: 'Senha definida com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao definir a senha', detalhes: erro.message });
    }
}

export default { listar, selecionar, inserir, alterar, demitir, definirSenha };
