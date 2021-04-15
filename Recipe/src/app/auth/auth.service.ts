import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

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
    user = new BehaviorSubject<User>(null);
    

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
        .pipe(
            catchError(this.handleError),
            tap(response => {
                this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
            })
        );
    }

    login(email: string, password: string) {
        return this.httpClient
        .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAiI20PC43ejH9-annXbGw6pTxijRqKxuY', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(response => {
                this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
            })
        );
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }

    logout() {
        this.user.next(null);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }

        switch(errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account.';
                break;

            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Password sign-in is disabled for this project';
                break;

            case 'TOO_MANY_ATTEMPTS_TRY_LATER': 
                errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;

            case 'EMAIL_NOT_FOUND':
                errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            
            case 'INVALID_PASSWORD': 
                errorMessage = 'The password is invalid or the user does not have a password.';
                break;
        }

        return throwError(errorMessage);
    }
}