const express = require('express');

const router = express.Router();
const rescue = require('express-rescue');
const getAllTalkers = require('../utils/readFile');
const writeNewTalker = require('../utils/writeFile');
const { 
    verifiedToken,
    verifiedName, 
    verifiedAge,
    verifiedRate, 
    verifiedDate,
    verifiedTalk } = require('../middlewares/talkerValidation');

router.get('/', rescue(async (req, res) => {
    const talkers = await getAllTalkers();
    res.status(200).json(talkers);
}));

router.get('/search', verifiedToken, rescue(async (req, res) => {
    const { q } = req.params;
    const talkers = await getAllTalkers();

    if (!q) return res.status(200).json(talkers);

    const talker = talkers.filter((talk) => talk.name.include(q));

    res.status(200).json(talker);

    console.log(talker);
}));

router.get('/:id', rescue(async (req, res) => {
    const talkers = await getAllTalkers();

    const talker = talkers.find((talk) => talk.id === parseInt(req.params.id, 10));

    if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    res.status(200).json(talker);
}));

router.post('/', 
    verifiedToken,
    verifiedName,
    verifiedAge, 
    verifiedTalk,
    verifiedDate,
    verifiedRate, 
    rescue(async (req, res) => {
    const { name, age, talk } = req.body;

    const talkers = await getAllTalkers();

    const newTalkerAuxiliation = { id: talkers.length + 1, name, age, talk };
    
    talkers.push(newTalkerAuxiliation);

    await writeNewTalker(talkers);
    
    res.status(201).json(newTalkerAuxiliation);
}));

router.delete('/:id', verifiedToken, rescue(async (req, res) => {
    const talkers = await getAllTalkers();

    const talkIndex = talkers.findIndex((tal) => tal.id === parseInt(req.params.id, 10));
    
    talkers.splice(talkIndex, 1);

    writeNewTalker(talkers);

    res.status(200).json({ message: 'Pessoa palestrante deletada com sucesso' });
}));

router.put('/:id', 
    verifiedToken, 
    verifiedName, 
    verifiedAge,
    verifiedTalk,
    verifiedRate,
    verifiedDate,
    rescue(async (req, res) => {
    const { name, age, talk } = req.body;

    const talkers = await getAllTalkers();

    const talkerIndex = talkers.findIndex(
            (talker) => talker.id === parseInt(req.params.id, 10),
        );

 //   const newTalkerAuxiliation = { id: talkers.length, name, age, talk };

    talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk };
    
    await writeNewTalker(talkers);

    console.log(talkers[talkerIndex]);

    res.status(200).json(talkers[talkerIndex]);
}));

module.exports = router;