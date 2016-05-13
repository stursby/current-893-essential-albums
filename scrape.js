'use strict'

const osmosis = require('osmosis')
const _ = require('lodash')
const fs = require('fs')
const URL = 'http://www.thecurrent.org/feature/2016/05/05/893-essential-albums'

let albums = []

osmosis
  .get(URL)
  .find('.contentArea h3 a')
  .follow('@href')
  .find('tr')
  .set({
    'rank':     'td[1]',
    'artwork':  'td[2] img@src',
    'artist':   'td[3]',
    'album':    'td[4]'
  })
  .then((context, data, next) => {
    if (context.index > 0) {
      albums.push(data)
    }
    next(context, data)
  })
  .done(saveJSON)

function saveJSON() {
  let ordered = _.sortBy(albums, ['rank', 'asc'], (album) => Number(album.rank))
  let data = JSON.stringify(ordered)
  fs.writeFile('./data/albums.json', data, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('JSON file saved!')
  })
}
