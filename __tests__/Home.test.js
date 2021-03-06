import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Home } from '../components'
import data from './data/home'

afterEach(cleanup)

it('renders the correct amount of images', () => {
  const { getAllByRole } = render(<Home projects={data} />)

  expect(getAllByRole('img')).toHaveLength(data.length)
})
