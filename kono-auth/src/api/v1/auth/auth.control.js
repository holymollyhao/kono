import { verify, update } from '../../../db/models/admin';
import { generateToken } from '../../../lib/token';

export const login = (req, res) => {
    
    const { password } = req.body;
    const { DEV_HOST, PROD_HOST, NODE_ENV } = process.env;
    const host = NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;
    
    if (!password) {
        res.status(400);
        res.clearCookie('access_token', { domain: host });
        res.send({ msg: 'password field required' });
        return;
    }

    verify(password, (admin) => {
        generateToken(admin,
            (token) => {
                res.status(200);
                res.cookie('access_token', token, {
                    maxAge: 1000 * 60 * 60,
                    domain: host
                });
                res.send({ msg: 'login success' });
            },
            (error) => {
                res.status(500);
                res.send({ msg: 'server error' });
                console.log(error);
            }
        );
    }, () => {
        res.status(403);
        res.clearCookie('access_token', { domain: host });
        res.send({ msg: 'wrong password' })
    }, () => {
        res.status(500);
        res.send({ msg: 'server error' });
    });

};

export const check = (req, res) => {
    if (req.admin)
        res.status(204);
    else
        res.status(403);
    res.end();
};

export const logout = (req, res) => {

    const { DEV_HOST, PROD_HOST, NODE_ENV } = process.env;
    const host = NODE_ENV === 'development' ? DEV_HOST : PROD_HOST;
	
    if (req.admin) {
        res.status(204);
        res.clearCookie('access_token', { domain: host });
        res.end();
    }
    else {
        res.status(403);
        res.end();
    }

}

export const updatePassword = (req, res) => {
    if (req.admin) {
        const { password } = req.body;
        if (!password) {
            res.status(400);
            res.send({ msg: 'password field required' });
            return;
        }
        if (typeof password !== 'string' || password.length > 20) {
            res.status(400);
            res.send({ msg: 'invalid password' });
            return;
        }
        update(req.admin, password,
            () => {
                res.status(204);
                res.end();
            }, () => {
                res.status(500);
                res.send({ msg: 'server error' });
            }
        );
    }
    else {
        res.status(403);
        res.end();
    }
}
