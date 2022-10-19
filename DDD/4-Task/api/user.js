'use strict';

module.exports = ({ db, common }) => {
    const userRepository = db('users');

    return {
        read(id) {
            return userRepository.read(id, ['id', 'login']);
        },

        async create({ login, password }) {
            const passwordHash = await common.hash(password);
            return userRepository.create({ login, password: passwordHash });
        },

        async update(id, { login, password }) {
            const passwordHash = await common.hash(password);
            return userRepository.update(id, { login, password: passwordHash });
        },

        delete(id) {
            return userRepository.delete(id);
        },

        find(mask) {
            const sql = 'SELECT login from users where login like $1';
            return userRepository.query(sql, [mask]);
        },
    }
}