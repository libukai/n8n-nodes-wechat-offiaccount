import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from 'n8n-workflow/dist/Interfaces';


class RequestUtils {
	static async originRequest(
		this: IExecuteFunctions,
		options: IRequestOptions,
		clearAccessToken = false,
	) {
		const credentials = await this.getCredentials('wechatOfficialAccountCredentialsApi');

		options.baseURL = `https://${credentials.baseUrl}`;

		// 每次调用都获取新 token（不依赖凭证系统）
		let accessToken = '';
		if (!clearAccessToken) {
			console.log('RequestUtils: 获取新 access_token');
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

			accessToken = tokenRes.access_token;
			console.log('RequestUtils: 获取到 token:', accessToken.substring(0, 20) + '...');
		}

		// 手动添加 token 到请求参数
		options.qs = {
			...options.qs,
			access_token: accessToken,
		};

		// 使用 requestWithAuthentication（它有正确的 formData 处理逻辑）
		// 传入空 accessToken 避免被 authenticate 配置覆盖
		return this.helpers.requestWithAuthentication.call(this, 'wechatOfficialAccountCredentialsApi', options, {
			// @ts-ignore
			credentialsDecrypted: {
				data: {
					...credentials,
					accessToken: '',
				},
			},
		});
	}

	static async request(this: IExecuteFunctions, options: IRequestOptions) {
		return RequestUtils.originRequest.call(this, options).then((text) => {
			const data: any = typeof text === 'string' ? JSON.parse(text) : text;

			// 检查错误（不再需要 42001 重试，因为每次都获取新 token）
			if (data.errcode && data.errcode !== 0) {
				throw new NodeOperationError(
					this.getNode(),
					`Request Error: ${data.errcode}, ${data.errmsg}`,
				);
			}

			return data;
		});
	}
}

export default RequestUtils;
