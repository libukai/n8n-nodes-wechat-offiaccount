import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class WechatOfficialAccountCredentialsApi implements ICredentialType {
	name = 'wechatOfficialAccountCredentialsApi';
	displayName = 'Wechat Official Account Credentials API';
	icon = 'file:icon.png';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'api.weixin.qq.com',
			required: true,
		},
		{
			displayName: 'Appid',
			description: '第三方用户唯一凭证，AppID和AppSecret可在"微信公众平台-设置与开发--基本配置"页中获得',
			name: 'appid',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'AppSecret',
			name: 'appsecret',
			description: '第三方用户唯一凭证密钥',
			// eslint-disable-next-line
			type: 'string',
			default: '',
			required: true,
		},
	];

	// 直接调用 stable_token API 测试凭证
	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '=https://{{$credentials.baseUrl}}',
			url: '/cgi-bin/stable_token',
			body: {
				grant_type: 'client_credential',
				appid: '={{$credentials.appid}}',
				secret: '={{$credentials.appsecret}}',
			},
			headers: {
				'Content-Type': 'application/json',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'errcode',
					value: 0,
					message: '凭证验证失败',
				},
			},
		],
	};
}
