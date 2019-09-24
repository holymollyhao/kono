import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import styles from '../styles/LoginPage.module.scss';
import { login } from '../api/auth';
import * as AuthActions from '../store/modules/auth';

const getInitialLoginErrorMsg = (query) => {
    switch (query.state) {
        case 'logout':
            return '로그아웃 되었습니다. 다시 로그인 해주세요.';
        case 'forbidden':
            return '접근할 수 없는 페이지입니다. 관리자 로그인이 필요합니다.';
        default:
            return '';
    }
}

export default withRouter(({ location, history }) => {

    /* Parse query string */
    const { search } = location;
    const query = queryString.parse(search);

    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [loginErrorMsg, setLoginErrorMsg] = useState(getInitialLoginErrorMsg(query));

    const onLogin = async () => {
        await login({ password })
            .then(
                (res) => {
                    dispatch(AuthActions.SetLogin('logged'));
                    history.push(`/${query.prev}`)
                }
            )
            .catch(
                (err) => {
                    if (err.response.data) {
                        const { msg } = err.response.data;
                        switch (msg) {
                            case 'password field required':
                                setLoginErrorMsg('비밀번호를 입력해 주세요.');
                                break;
                            case 'wrong password':
                                setLoginErrorMsg('비밀번호가 올바르지 않습니다.');
                                break;
                            case 'server error':
                                setLoginErrorMsg('서버 에러');
                                break;
                            default:
                                setLoginErrorMsg('서버 에러');
                                break;
                        }
                    }
                    else {
                        setLoginErrorMsg('서버에 접속할 수 없습니다.');
                    }
                    
                }
            );
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginPage__header}> 
                학생복지위원회 관리자용 로그인
            </div>
            <input className={styles.LoginPage__input}
                type="password"
                placeholder="비밀번호"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { e.keyCode === 13 && onLogin(); }}
            />
            <span className={styles.LoginPage__input_error}>
                { loginErrorMsg }
            </span>
            <div
                className={styles.LoginPage__button}
                onClick={onLogin}
            >
                로그인
            </div>
        </div>
    );
});