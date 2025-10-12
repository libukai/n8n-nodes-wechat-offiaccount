import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';

export default {
	name: '获取AccessToken',
	value: 'auth:getAccessToken',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const credentials = await this.getCredentials('wechatOfficialAccountCredentialsApi');

		// 直接调用 stable_token 获取当前有效的 access_token
		const tokenRes = (await this.helpers.httpRequest({
			method: 'POST',
			url: `https://${credentials.baseUrl}/cgi-bin/stable_token`,
			body: {
				grant_type: 'client_credential',
				appid: credentials.appid,
				secret: credentials.appsecret,
			},
			headers: {
				'Content-Type': 'application/json',
			},
		})) as any;

		if (tokenRes.errcode && tokenRes.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取 access_token 失败：${tokenRes.errcode}, ${tokenRes.errmsg}`,
			);
		}

		return {
			accessToken: tokenRes.access_token,
		};
	},
} as ResourceOperations;
