import Orbit from '@orbit/data';
import Source from 'ember-orbit/source';
import Bucket from 'ember-orbit/bucket';
import JSONAPISource from '@orbit/jsonapi';
import LocalStorageSource from '@orbit/local-storage';
import LocalStorageBucket from '@orbit/local-storage-bucket';
import IndexedDBSource, { supportsIndexedDB } from '@orbit/indexeddb';
import IndexedDBBucket from '@orbit/indexeddb-bucket';
import fetch from 'ember-network/fetch';

const RemoteSource = Source.extend({
  OrbitSourceClass: JSONAPISource,
  orbitSourceOptions: { name: 'remote' }
});

const BackupSource = Source.extend({
  OrbitSourceClass: supportsIndexedDB ? IndexedDBSource : LocalStorageSource,
  orbitSourceOptions: { name: 'backup', namespace: 'peeps' }
});

const SettingsBucket = Bucket.extend({
  OrbitBucketClass: supportsIndexedDB ? IndexedDBBucket : LocalStorageBucket,
  orbitBucketOptions: { namespace: 'peeps-settings' }
});

export function initialize(application) {
  Orbit.fetch = fetch;

  application.register('data-source:remote', RemoteSource);
  application.register('data-source:backup', BackupSource);

  application.register('data-bucket:main', SettingsBucket);
  application.inject('data-source', 'bucket', 'data-bucket:main');
}

export default {
  name: 'data',
  initialize
};
