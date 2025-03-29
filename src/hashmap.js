export class HashMap {
  constructor(loadFactor = 0.8, capacity = 16) {
    this.loadFactor = loadFactor;
    this.capacity = capacity;
    this.buckets = new Array(capacity).fill(null).map(() => []);
    this.size = 0;
  }

  hash(key) {
    let hashCode = 0;
    for (let i = 0; i < key.length; i++) {
      hashCode = ((hashCode << 5) - hashCode + key.charCodeAt(i)) | 0;
    }

    return Math.abs(hashCode) % this.capacity;
  }

  set(key, value) {
    const index = this.hash(key);
    let bucket = this.buckets[index];

    if (!bucket) {
      bucket = this.buckets[index] = [];
    }

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    if (this.size / this.capacity > this.loadFactor) {
      this.resize();
    }

    bucket.push([key, value]);
    this.size++;
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return bucket[i][1];
      }
    }
    return null;
  }

  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        return true;
      }
    }
    return false;
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
  }

  keys() {
    let keys = [];
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        keys.push(this.buckets[i][j][0]);
      }
    }
    return keys;
  }

  values() {
    let values = [];
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        values.push(this.buckets[i][j][1]);
      }
    }
    return values;
  }

  entries() {
    let entries = [];
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        entries.push(this.buckets[i][j]);
      }
    }
    return entries;
  }

  resize() {
    const newCapacity = this.buckets.length * 2; // Double the capacity
    const newBuckets = new Array(newCapacity).fill(null).map(() => []); // New buckets array

    // Rehash all elements into the new buckets
    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];
      for (let j = 0; j < bucket.length; j++) {
        const [key, value] = bucket[j];
        const newIndex = this.hash(key) % newCapacity; // Rehash the key
        newBuckets[newIndex].push([key, value]); // Push to the new bucket
      }
    }

    // Replace old buckets with new buckets
    this.buckets = newBuckets;
    this.capacity = newCapacity; // Update capacity
  }
}
