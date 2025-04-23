import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";
import Usuario from "../model/UsuarioModel.js";
import moment from 'moment';

async function listar(req, res) {
    const respostaBanco = await Emprestimo.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Emprestimo.findByPk(id);
    res.json(respostaBanco);
}

async function emprestar(req, res) {
    const idlivro = req.body.idlivro;
    const idusuario = req.body.idusuario;

    if (!idlivro) {
        return res.status(422).send('O parâmetro idlivro é obrigatório.');
    }

    if (!idusuario) {
        return res.status(422).send('O parâmetro idusuario é obrigatório.');
    }

    const livroBanco = await Livro.findByPk(idlivro);
    if (!livroBanco) {
        return res.status(404).send('Livro não encontrado.');
    }

    const usuarioBanco = await Usuario.findByPk(idusuario);
    if (!usuarioBanco) {
        return res.status(404).send('Usuário não encontrado.');
    }

    if (!livroBanco.ativo) {
        return res.status(422).send('Este livro está inativo.');
    }

    if (livroBanco.emprestado) {
        return res.status(422).send('Este livro já está emprestado.');
    }

    const emprestimosPendentes = await Emprestimo.findOne({
        where: {
            idusuario: idusuario,
            devolucao: null  // O empréstimo ainda não foi devolvido
        }
    });

    if (emprestimosPendentes) {
        return res.status(422).send('Este usuário já tem um empréstimo pendente.');
    }

    const emprestimo = moment().format('YYYY-MM-DD');
    const vencimento = moment().add(15, 'days').format('YYYY-MM-DD');

    const respostaBanco = await Emprestimo.create({ idlivro, idusuario, emprestimo, vencimento });

    await Livro.update(
        { emprestado: true },
        { where: { idlivro } }
    );

    res.json(respostaBanco);
}

async function devolver(req, res) {
    const idemprestimo = req.params.id;

    const emprestimoBanco = await Emprestimo.findByPk(idemprestimo);
    if (!emprestimoBanco) {
        return res.status(404).send('Empréstimo não encontrado.');
    }

    const devolucao = moment().format('YYYY-MM-DD');
    const observacao = req.body.observacao || null;

    await Emprestimo.update(
        { devolucao, observacao },
        { where: { idemprestimo } }
    );

    await Livro.update(
        { emprestado: false },
        { where: { idlivro: emprestimoBanco.idlivro } }
    );

    res.json({ message: 'Empréstimo devolvido com sucesso.' });
}

export default { listar, selecionar, emprestar, devolver };
