import { gql } from '@apollo/client'

// GraphQL queries for Hasura integration (UI mock - no actual queries)
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      email
      name
      plan
      api_key
      created_at
      updated_at
    }
  }
`

export const GET_HUMANIZE_JOBS = gql`
  query GetHumanizeJobs($userId: uuid!, $limit: Int = 50, $offset: Int = 0) {
    humanize_jobs(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      status
      input_text
      output_text
      tone
      degree
      word_count
      file_name
      file_type
      created_at
      updated_at
    }
    humanize_jobs_aggregate(where: { user_id: { _eq: $userId } }) {
      aggregate {
        count
        sum {
          word_count
        }
      }
    }
  }
`

export const GET_HUMANIZE_JOB = gql`
  query GetHumanizeJob($jobId: uuid!) {
    humanize_jobs_by_pk(id: $jobId) {
      id
      user_id
      status
      input_text
      output_text
      tone
      degree
      word_count
      file_name
      file_type
      created_at
      updated_at
    }
  }
`

export const CREATE_HUMANIZE_JOB = gql`
  mutation CreateHumanizeJob($input: humanize_jobs_insert_input!) {
    insert_humanize_jobs_one(object: $input) {
      id
      status
      created_at
    }
  }
`

export const UPDATE_HUMANIZE_JOB = gql`
  mutation UpdateHumanizeJob($jobId: uuid!, $updates: humanize_jobs_set_input!) {
    update_humanize_jobs_by_pk(
      pk_columns: { id: $jobId }
      _set: $updates
    ) {
      id
      status
      output_text
      updated_at
    }
  }
`

export const DELETE_HUMANIZE_JOB = gql`
  mutation DeleteHumanizeJob($jobId: uuid!) {
    delete_humanize_jobs_by_pk(id: $jobId) {
      id
    }
  }
`

export const SUBSCRIBE_TO_JOB_STATUS = gql`
  subscription SubscribeToJobStatus($jobId: uuid!) {
    humanize_jobs_by_pk(id: $jobId) {
      id
      status
      output_text
      updated_at
    }
  }
`

// N8N webhook endpoints (for reference)
export const N8N_ENDPOINTS = {
  HUMANIZE_WEBHOOK: '/webhook/humanize',
  FILE_UPLOAD_WEBHOOK: '/webhook/upload',
  JOB_STATUS_WEBHOOK: '/webhook/job-status'
}

// Mock data for UI development
export const MOCK_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'pro' as const,
  api_key: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z'
}

export const MOCK_JOBS = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    user_id: MOCK_USER.id,
    status: 'completed' as const,
    input_text: 'AI-generated text that needs to be humanized...',
    output_text: 'Natural, human-like text that flows better...',
    tone: 'casual' as const,
    degree: 'medium' as const,
    word_count: 150,
    file_name: null,
    file_type: null,
    created_at: '2025-12-02T10:00:00Z',
    updated_at: '2025-12-02T10:02:00Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    user_id: MOCK_USER.id,
    status: 'processing' as const,
    input_text: 'Another piece of AI text...',
    output_text: null,
    tone: 'formal' as const,
    degree: 'high' as const,
    word_count: 200,
    file_name: 'document.pdf',
    file_type: 'application/pdf',
    created_at: '2025-12-02T11:00:00Z',
    updated_at: '2025-12-02T11:00:00Z'
  }
]