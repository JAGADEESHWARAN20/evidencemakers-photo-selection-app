/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiClientConfig {
  baseUrl: string;
  adminToken?: string;
  clientShareToken?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
      adminToken: config?.adminToken,
      clientShareToken: config?.clientShareToken,
    };
  }

  public setAdminToken(token: string) {
    this.config.adminToken = token;
  }

  public setClientShareToken(token: string) {
    this.config.clientShareToken = token;
  }

  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.config.baseUrl || 'http://localhost:3000');
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.adminToken) {
      headers['Authorization'] = `Bearer ${this.config.adminToken}`;
    } else if (this.config.clientShareToken) {
      headers['X-Evidence-Share-Token'] = this.config.clientShareToken;
    }

    const res = await fetch(url.toString(), { credentials: 'omit', headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `API GET error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  public async post<T, B = unknown>(endpoint: string, body: B): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.config.baseUrl || 'http://localhost:3000');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.adminToken) {
      headers['Authorization'] = `Bearer ${this.config.adminToken}`;
    } else if (this.config.clientShareToken) {
      headers['X-Evidence-Share-Token'] = this.config.clientShareToken;
    }

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `API POST error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  public async patch<T, B = unknown>(endpoint: string, body: B): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.config.baseUrl || 'http://localhost:3000');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.adminToken) {
      headers['Authorization'] = `Bearer ${this.config.adminToken}`;
    } else if (this.config.clientShareToken) {
      headers['X-Evidence-Share-Token'] = this.config.clientShareToken;
    }

    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `API PATCH error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }
}
