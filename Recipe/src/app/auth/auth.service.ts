import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    signup(email: string, password: string) {
        return this.httpClient
        .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAiI20PC43ejH9-annXbGw6pTxijRqKxuY', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(errorResponse => {
            let errorMessage = 'An unknown error occured';

            if (!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            }

            switch(errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email address is already in use by another account.';

                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'Password sign-in is disabled for this project';

                case 'TOO_MANY_ATTEMPTS_TRY_LATER': 
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            }

            return throwError(errorMessage);
        }));
    }

    login(email: string, password: string) {
        return this.httpClient.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAiI20PC43ejH9-annXbGw6pTxijRqKxuY', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
    }
}