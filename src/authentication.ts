import jwksClient, { JSONWebKey } from 'jwks-rsa';
import jwt from 'jsonwebtoken';

//better place for these?
const region = 'us-east-1';
const userPoolId = 'us-east-1_h21W3I0pW';
const jwksUri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

const client = jwksClient({ jwksUri });

export function verifyToken(token: string): Promise<any> {
	if(!token) {
		return Promise.reject('Unauthorized');
	}

	const [issuer, jwtToken] = token.split(' ');
	return new Promise((resolve, reject) => {
		jwt.verify(jwtToken, getKey, {},
			(err, result) => err ? reject(err) : resolve(result));
	});
}

function getKey(header: JSONWebKey, cb): void {
	client.getSigningKey(header.kid)
		.then(
			key => cb(null, key.getPublicKey()),
			err => cb(err)
		);
}

